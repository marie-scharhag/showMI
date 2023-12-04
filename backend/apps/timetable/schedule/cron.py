from apps.timetable.image_generation.imageGenerator import generate_lecture_image, generate_default_image
from apps.timetable.image_transmission.exampleTransmission import ExampleBeamer
from apps.timetable.models import Lecture, Room, Document
from datetime import datetime, timedelta
from django.utils import timezone


def execute_timetable():
    """
    Executes the timetable for the current time, generating and displaying lecture images or default images on beamers.

    This function retrieves the current weekday and iterates over all rooms, connecting to beamers associated with each room.
    It then retrieves lectures and documents scheduled for the current time, generates images for them, and displays the images on connected beamers.
    If no scheduled lectures or documents are found, it generates and displays default images on connected beamers.
    """
    now = timezone.now()
    weekday = now.weekday()
    weekday_value = Lecture.WEEK_DAYS[weekday][0]

    rooms = Room.objects.all()
    for room in rooms:
        beamerObjects = Beamer.objects.find(room=room)
        beamers =[]
        for beamer in beamerObjects:
            connect_beamer = ExampleBeamer(ip_address=beamer.ip_address, port=beamer.port)
            beamers.append(connect_beamer)
            # connect_beamer.connect()

        print("ROOM", room)
        lectures = Lecture.objects.filter(weekday=weekday_value,room=room)
        images = []
        for lecture in lectures:
            if lecture_in_time(lecture, now):
                image_stream = generate_lecture_image(lecture, room)
                images.append(image_stream)
                # print('SEND IMAGE', image_stream, 'TO', room.beamer)

        if len(images) == 0:
            next_lectures = next_lecture_for_day(lectures,now)
            for lecture in next_lectures:
                image_stream = generate_lecture_image(lecture, room)
                images.append(image_stream)

        documents = Document.objects.filter(rooms=room)
        print(documents)

        for document in documents:
            document_start_time = document.start
            document_end_time = document.end
            print(document.onlyDisplay)
            if document_start_time <= now <= document_end_time:
                if document.onlyDisplay:
                    images = document.documentData
                else:
                    # TODO Byte Stream
                    images.append(document.documentData)

        print(images)
        if images:
            for beamer in beamers:
                generate_slideshow(beamer, images)
        else:
            default_image = generate_default_image(room)
            for beamer in beamers:
                send_image(beamer, default_image)


def lecture_in_time(lecture, now):
    """
    Checks if the given lecture is currently ongoing.

    Args:
    - lecture (Lecture): The lecture object.
    - now (datetime): The current datetime.

    Returns:
    - bool: True if the lecture is ongoing, False otherwise.
    """
    lecture_start_time = timezone.make_aware(datetime.combine(now.date(), lecture.start) - timedelta(minutes=15))
    lecture_end_time = timezone.make_aware(datetime.combine(now.date(), lecture.end) + timedelta(minutes=15))

    if lecture_start_time <= now <= lecture_end_time:
        return True
    return False


def next_lecture_for_day(lectures, now):
    """
    Finds the next scheduled lectures for the current day.

    Args:
    - lectures (QuerySet): The queryset of Lecture objects.
    - now (datetime): The current datetime.

    Returns:
    - list: List of Lecture objects representing the next scheduled lectures for the day.
    """
    next_lectures = []
    for lecture in lectures:
        lecture_start_time = timezone.make_aware(datetime.combine(now.date(), lecture.start))

        if lecture_start_time > now:
            next_lectures.append(lecture)
    return next_lectures


def generate_slideshow(beamer, images):
    """
    Generates a slideshow and displays it on the specified beamer.

    Args:
    - beamer (ExampleBeamer): The beamer object to display the slideshow on.
    - images (list): List of image streams for the slideshow.
    """
    if len(images) >= 1:
        pass
    else:
        send_image(beamer,images[0])


def send_image(beamer,image):
    """
    Connects to the specified beamer and displays the given image.

    Args:
    - beamer (ExampleBeamer): The beamer object to connect to.
    - image: The image to display on the beamer.
    """

    beamer.connect()
    beamer.display_image(image)





