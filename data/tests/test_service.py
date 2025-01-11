# File: tests/test_service.py

import pytest
from loguru import logger
from services.service import clean_and_transform_data, parse_participant_flow


logger.add("debug.log", format="{time} {level} {message}", level="DEBUG")


def test_clean_and_transform_data():
    """
    Test the clean_and_transform_data function with a fake raw_json input.
    Ensures that the function correctly cleans and transforms the data.
    """
    logger.info("Starting test for clean_and_transform_data function")

    # Fake raw_json input with hasResults=False, expecting no studies after cleaning
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

    logger.debug(f"Input raw JSON data: {raw_json}")

    # Expected output is an empty list since hasResults=False
    expected = []

    logger.debug(f"Expected transformed data: {expected}")

    # Perform the transformation
    result = clean_and_transform_data(raw_json)

    logger.debug(f"Actual transformed data: {result}")

    # Assertions
    assert result == expected, "Expected no studies after cleaning, but some were returned."
    logger.info("test_clean_and_transform_data passed successfully")


def test_parse_participant_flow():
    """
    Test the parse_participant_flow function with example data.
    Ensures that the function correctly parses participant flow information.
    """
    logger.info("Starting test for parse_participant_flow function")

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

    logger.debug(f"Input results section data: {results_section}")

    # Expected output
    expected = {
        "totalStarted": 50,
        "totalCompleted": 40,
        "totalDropped": 5,
        "dropReasons": {
            "Withdrawal by Subject": 5
        }
    }

    logger.debug(f"Expected parsed participant flow data: {expected}")

    # Perform the parsing
    flow = parse_participant_flow(results_section)

    logger.debug(f"Actual parsed participant flow data: {flow}")

    # Assertions
    assert flow == expected, "Participant flow data does not match expected output."
    logger.info("test_parse_participant_flow passed successfully")


def test_clean_and_transform_data_with_multiple_studies():
    """
    Test the clean_and_transform_data function with multiple studies.
    Ensures that the function correctly filters studies based on 'hasResults'.
    """
    logger.info("Starting test for clean_and_transform_data function with multiple studies")

    raw_json = {
        "studies": [
            {
                "protocolSection": {
                    "identificationModule": {
                        "nctId": "NCT12345678",
                        "briefTitle": "Study Title Example"
                    },
                    "statusModule": {
                        "overallStatus": "Recruiting",
                        "startDateStruct": {
                            "date": "2021-01-01"
                        }
                    },
                    "designModule": {
                        "enrollmentInfo": {
                            "count": 100
                        }
                    },
                    "conditionsModule": {
                        "conditions": ["Condition1", "Condition2"]
                    }
                },
                "hasResults": True
            },
            {
                "protocolSection": {
                    "identificationModule": {
                        "nctId": "NCT87654321",
                        "briefTitle": "Another Study Title"
                    },
                    "statusModule": {
                        "overallStatus": "Completed",
                        "startDateStruct": {
                            "date": "2020-06-15"
                        }
                    },
                    "designModule": {
                        "enrollmentInfo": {
                            "count": 50
                        }
                    },
                    "conditionsModule": {
                        "conditions": ["ConditionA"]
                    }
                },
                "hasResults": False
            }
        ]
    }

    logger.debug(f"Input raw JSON data with multiple studies: {raw_json}")

    # Expected output with only the study that has results
    expected = [{
        "nctId": "NCT12345678",
        "briefTitle": "Study Title Example",
        "overallStatus": "Recruiting",
        "hasResults": True,
        "enrollment_count": 100,
        "start_date": "2021-01-01",
        "conditions": ["Condition1", "Condition2"]
    }]

    logger.debug(f"Expected transformed data with filtered studies: {expected}")

    cleaned_data = clean_and_transform_data(raw_json)
    logger.debug(f"Cleaned data after transformation: {cleaned_data}")

    assert len(cleaned_data) == 1, f"Expected 1 study after cleaning, got {len(cleaned_data)}."
    assert cleaned_data[0]["nctId"] == "NCT12345678", "NCT ID does not match expected value."
    assert cleaned_data[0]["enrollment_count"] == 100, "Enrollment count does not match expected value."

    # Perform the transformation
    result = clean_and_transform_data(raw_json)

    logger.debug(f"Actual transformed data: {result}")

    # Assertions
    assert result == expected, "Transformed data does not match expected output."
    logger.info("test_clean_and_transform_data_with_multiple_studies passed successfully")