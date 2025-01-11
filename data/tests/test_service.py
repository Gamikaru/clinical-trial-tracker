# tests/test_service.py

import pytest
from services.service import clean_and_transform_data, parse_participant_flow

def test_clean_and_transform_data():
    # Fake raw_json
    raw_json = {
        "studies": [
            {
                "hasResults": False,
                "protocolSection": {
                    "identificationModule": {
                        "nctId": "NCT12345678",
                        "briefTitle": "Fake Title"
                    },
                    "statusModule": {
                        "overallStatus": "RECRUITING",
                        "startDateStruct": {"date": "2024-01-01"}
                    },
                    "designModule": {
                        "enrollmentInfo": {"count": 100}
                    },
                    "conditionsModule": {
                        "conditions": ["Cancer"]
                    }
                }
            }
        ]
    }

    result = clean_and_transform_data(raw_json)
    assert len(result) == 1
    assert result[0]["nctId"] == "NCT12345678"
    assert result[0]["overallStatus"] == "RECRUITING"
    assert result[0]["enrollment"] == 100
    assert result[0]["conditions"] == ["Cancer"]

def test_parse_participant_flow():
    # Example data with milestones and dropWithdraw
    results_section = {
        "participantFlowModule": {
            "periods": [
                {
                    "milestones": [
                        {"type": "STARTED", "achievements": [{"flowAchievementNumSubjects": "50"}]},
                        {"type": "COMPLETED", "achievements": [{"flowAchievementNumSubjects": "40"}]}
                    ],
                    "dropWithdraws": [
                        {
                            "type": "Withdrawal by Subject",
                            "reasons": [{"numSubjects": "5"}]
                        }
                    ]
                }
            ]
        }
    }
    flow = parse_participant_flow(results_section)
    assert flow["totalStarted"] == 50
    assert flow["totalCompleted"] == 40
    assert flow["totalDropped"] == 5
    assert flow["dropReasons"]["Withdrawal by Subject"] == 5
