import sys
import json
from datetime import datetime, timedelta
from collections import defaultdict

def parse_time(time_str):
    return datetime.strptime(time_str, "%H:%M")

def format_time(dt):
    return dt.strftime("%H:%M")

def assign_cleaning_tasks(elderly_list, cleaner_list, existing_schedule):
    schedule = []
    used = defaultdict(lambda: defaultdict(list))
    existing_map = defaultdict(lambda: defaultdict(dict))
    cleaner_days = {c['id']: set(c['workDays']) for c in cleaner_list}

    # שמירת משבצות קיימות
    for item in existing_schedule:
        start = parse_time(item['startTime'])
        end = parse_time(item['endTime'])
        used[item['cleanerId']][item['day']].append({'start': start, 'end': end})
        existing_map[item['apartmentId']][item['day']] = item

    new_schedule = []

    for elderly in elderly_list:
        apt_id = elderly.get('apartmentId')
        if not apt_id:
            continue

        for pref in elderly['preferredTimes']:
            day = pref['day']
            start = parse_time(pref['time'])
            end = start + timedelta(minutes=elderly['cleaningDurationMinutes'])

            existing = existing_map.get(apt_id, {}).get(day)
            if existing and existing['startTime'] == format_time(start) and existing['endTime'] == format_time(end):
                schedule.append({
                    'apartmentId': apt_id,
                    'cleanerId': existing['cleanerId'],
                    'day': day,
                    'startTime': existing['startTime'],
                    'endTime': existing['endTime'],
                    'note': existing.get('note', ''),
                    'status': 'unchanged'
                })
                continue

            # נסה להקצות מנקה פנוי
            best_option = None
            for cleaner in cleaner_list:
                cid = cleaner['id']
                if day not in cleaner_days[cid]:
                    continue
                conflict = any(not (end <= slot['start'] or start >= slot['end']) for slot in used[cid][day])
                if not conflict:
                    if not best_option or len(used[best_option['cleanerId']][day]) > len(used[cid][day]):
                        best_option = {
                            'apartmentId': apt_id,
                            'cleanerId': cid,
                            'day': day,
                            'startTime': format_time(start),
                            'endTime': format_time(end),
                            'note': '',
                            'status': 'new'
                        }

            if best_option:
                used[best_option['cleanerId']][day].append({'start': start, 'end': end})
                new_schedule.append(best_option)
                continue

            # נסה לבצע החלפה חכמה
            swapped = False
            for cleaner in cleaner_list:
                cid = cleaner['id']
                if day not in cleaner_days[cid]:
                    continue
                for existing_slot in used[cid][day]:
                    for alt_cleaner in cleaner_list:
                        alt_id = alt_cleaner['id']
                        if alt_id == cid or day not in cleaner_days[alt_id]:
                            continue
                        conflict = any(
                            not (existing_slot['end'] <= slot['start'] or existing_slot['start'] >= slot['end'])
                            for slot in used[alt_id][day]
                        )
                        if not conflict:
                            used[cid][day].remove(existing_slot)
                            used[alt_id][day].append(existing_slot)

                            used[cid][day].append({'start': start, 'end': end})
                            new_schedule.append({
                                'apartmentId': apt_id,
                                'cleanerId': cid,
                                'day': day,
                                'startTime': format_time(start),
                                'endTime': format_time(end),
                                'note': 'Assigned via smart swap',
                                'status': 'swapped'
                            })
                            swapped = True
                            break
                    if swapped:
                        break
                if swapped:
                    break

            if not swapped:
                new_schedule.append({
                    'apartmentId': apt_id,
                    'cleanerId': None,
                    'day': day,
                    'startTime': format_time(start),
                    'endTime': format_time(end),
                    'note': 'No cleaner available (even after swap)',
                    'status': 'unassigned'
                })

    return schedule + new_schedule

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python cleaning_scheduler.py <input_json_file>")
        sys.exit(1)

    input_filename = sys.argv[1]

    try:
        with open(input_filename, "r", encoding="utf-8") as f:
            input_data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}", file=sys.stderr)
        sys.exit(1)

    result = assign_cleaning_tasks(
        input_data.get("elderlyList", []),
        input_data.get("cleanerList", []),
        input_data.get("existingSchedule", [])
    )

    print(json.dumps(result, ensure_ascii=False, indent=2))
