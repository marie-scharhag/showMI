import csv
from io import StringIO
from datetime import datetime, timedelta
from django.core.exceptions import ValidationError

from .abstract import TimetableLoader
from ..models import  Study, Room, Lecture #Timeslot,
from django.contrib.auth import get_user_model

from ...app_user.models import AppUser



class CsvTimetableLoader(TimetableLoader):
    def validate_model_field(self, field_name, value, valid_values):
        """
        Validate a specific model field value.

        Args:
            field_name (str): The name of the field.
            value (str): The value to be validated.
            valid_values (list): List of valid values for the field.

        Raises:
            ValidationError: If the value is not in the list of valid values.
        """
        if value not in valid_values:
            raise ValidationError(f"Invalid Value in column '{field_name}'. Valid values: {', '.join(valid_values)}")

    def validate_csv_row(self, row):
        """
        Validate a CSV row for required columns and data format.

        Args:
            row (dict): A dictionary representing a CSV row.

        Raises:
            ValidationError: If the row is missing required columns or contains invalid data.
        """
        required_columns = ['Raum', 'Stg', 'LV-Nr', 'Fachsem1', 'LV-Name', 'Typ', 'Grp', 'Doz1NName', 'Doz1VName',
                            'WTag', 'Startzeit', 'Dauer_min']

        for column in required_columns:
            if column not in row:
                raise ValidationError(f"The column '{column}' is missing in CSV-File.")

        try:
            datetime.strptime(row['Startzeit'], "%H:%M:%S")
        except ValueError:
            raise ValidationError("Invalid Time Format in column 'Startzeit'.")

        try:
            int(row['Dauer_min'])
        except ValueError:
            raise ValidationError("The column 'Dauer_min' has to be an Integer value.")

        self.validate_model_field('Typ', row['Typ'], [typ[0] for typ in Lecture.TYPES])
        self.validate_model_field('Stg', row['Stg'][:2].upper(), [study[0] for study in Study.STUDYS])
        self.validate_model_field('WTag', row['WTag'].upper(), [day[0] for day in Lecture.WEEK_DAYS])

    def load_timetable_data(self, data_source):
        """
        Load timetable data from a CSV file.

        Args:
            data_source: The source containing the timetable data.

        Raises:
            ValidationError: If the CSV file contains invalid data.
        """
        semester_timetable = data_source
        print(semester_timetable.id)
        decoded_file = semester_timetable.timetable_data.read().decode('utf-8')
        header, *data = decoded_file.split('/n')
        csv_content = f"{header}\n{':'.join(data)}"
        csv_reader = csv.DictReader(StringIO(csv_content), delimiter=';')
        for row in csv_reader:
            self.validate_csv_row(row)

            start_time = datetime.strptime(row['Startzeit'], "%H:%M:%S")
            end_time = start_time + timedelta(minutes=int(row['Dauer_min']))

            email = row['Doz1VName'].replace(' ', '.').lower() + '.' + row['Doz1NName'].lower() + '@hs-rm.de'

            teacher, created = AppUser.objects.get_or_create(last_name=row['Doz1NName'], first_name=row['Doz1VName'],email=email)
            if created:
                teacher.save()

            study,_ = Study.objects.get_or_create(studyName=row['Stg'][:2])
            study.teachers.add(teacher)

            building = f"{row['Raum'][0].upper()}-Gebäude"
            floor = f"{row['Raum'][1]}. Stock"
            room,_ = Room.objects.get_or_create(roomNr=row['Raum'], building=building, floor=floor)
            room.studys.add(study)

            lecture,_ = Lecture.objects.get_or_create(lectureNr=row['LV-Nr'], lectureName=row['LV-Name'],
                                                  semester=row['Fachsem1'], typ=row['Typ'], group=row['Grp'],
                                                  study=study,weekday=row['WTag'].upper(), start=start_time, end=end_time, semester_timetable=semester_timetable)

            lecture.room.add(room)
            lecture.teacher.add(teacher)
            print('LECTURE', lecture)
