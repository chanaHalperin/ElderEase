# test_scheduler.py
import json
from smart_cleaning_scheduler import assign_tasks

def test_assign_tasks_sample():
    with open("sample_input.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    result = assign_tasks(
        data["elderlyList"],
        data["cleanerList"],
        data["existingSchedule"]
    )

    assert isinstance(result, list)
    assert len(result) == 3  # e1 has 2 prefs, e2 has 1

    # Check that the existing assignment for e1 on Sunday remains untouched
    for r in result:
        if r["elderlyId"] == "e1" and r["day"] == "Sunday":
            assert r["cleanerId"] == "c1"
            assert r["startTime"] == "09:00"
            assert r["endTime"] == "10:15"
