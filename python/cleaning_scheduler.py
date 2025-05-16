import sys
import json
from datetime import datetime, timedelta

def parse_time(time_str):
    print(f"Parsing time: {time_str}")
    return datetime.strptime(time_str, "%H:%M")

def format_time(dt):
    return dt.strftime("%H:%M")

def assign_cleaning_tasks(elderly_list, cleaner_list):
    print("Starting assignment of cleaning tasks")
    schedule = []
    cleaner_availability = {cleaner["id"]: {} for cleaner in cleaner_list}
    print(f"Initialized availability for {len(cleaner_list)} cleaners")

    for elderly in elderly_list:
        print(f"Processing elderly ID: {elderly['id']}")
        for pref in elderly.get("preferredTimes", []):
            day = pref["day"]
            start_time = parse_time(pref["time"])
            duration_minutes = elderly["apartmentSize"] * 1.5
            end_time = start_time + timedelta(minutes=duration_minutes)
            print(f"  Preferred time: {day} {format_time(start_time)} to {format_time(end_time)}")

            assigned = False
            for cleaner in cleaner_list:
                print(f"    Checking cleaner ID: {cleaner['id']}")
                if day not in cleaner["workDays"]:
                    print(f"      Cleaner does not work on {day}")
                    continue

                cleaner_schedule = cleaner_availability[cleaner["id"]].setdefault(day, [])
                conflict = any(
                    not (end_time <= booked["start"] or start_time >= booked["end"])
                    for booked in cleaner_schedule
                )
                print(f"      Conflict: {conflict}")

                if not conflict:
                    cleaner_schedule.append({"start": start_time, "end": end_time})
                    schedule.append({
                        "elderlyId": elderly["id"],
                        "cleanerId": cleaner["id"],
                        "day": day,
                        "startTime": format_time(start_time),
                        "endTime": format_time(end_time)
                    })
                    print(f"      Assigned to cleaner ID: {cleaner['id']}")
                    assigned = True
                    break

            if not assigned:
                print(f"      No cleaner available for elderly ID {elderly['id']} on {day}")
                schedule.append({
                    "elderlyId": elderly["id"],
                    "cleanerId": None,
                    "day": day,
                    "startTime": format_time(start_time),
                    "endTime": format_time(end_time),
                    "note": "No cleaner available"
                })

    print("Assignment complete")
    return schedule

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python cleaning_scheduler.py <input_json_file>")
        sys.exit(1)

    input_filename = sys.argv[1]

    with open(input_filename, "r", encoding="utf-8") as f:
        input_data = json.load(f)

    print("Input data loaded from file:", input_filename)
    result = assign_cleaning_tasks(input_data["elderlyList"], input_data["cleanerList"])
    print("Result calculated")
    print(json.dumps(result, ensure_ascii=False, indent=2))
