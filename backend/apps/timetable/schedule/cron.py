from apps.timetable.image_generation.imageGenerator import generate_lecture_image, generate_default_image
from apps.timetable.image_transmission.exampleTransmission import ExampleBeamer
from apps.timetable.models import Lecture, Room, Document
from datetime import datetime, timedelta
from django.utils import timezone


def execute_timetable():
    now = timezone.now()
    weekday = now.weekday()
    weekday_value = Lecture.WEEK_DAYS[weekday][0]

    rooms = Room.objects.all()
    for room in rooms:
        beamer = ExampleBeamer(ip_address=room.beamer, port=room.beamer)
        beamer.connect()

        print("ROOM", room)
        lectures = Lecture.objects.filter(weekday=weekday_value,room=room)
        # print(lectures)
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
            generate_slideshow(room, images)
        else:
            default_image = generate_default_image(room)
            send_image(beamer, default_image)


def lecture_in_time(lecture, now):
    lecture_start_time = timezone.make_aware(datetime.combine(now.date(), lecture.start) - timedelta(minutes=15))
    lecture_end_time = timezone.make_aware(datetime.combine(now.date(), lecture.end) + timedelta(minutes=15))

    if lecture_start_time <= now <= lecture_end_time:
        return True
    return False


def next_lecture_for_day(lectures, now):
    next_lectures = []
    for lecture in lectures:
        lecture_start_time = timezone.make_aware(datetime.combine(now.date(), lecture.start))

        if lecture_start_time > now:
            next_lectures.append(lecture)
    return next_lectures


def generate_slideshow(beamer, images):
    if len(images) >= 1:
        pass
    else:
        send_image(beamer,images[0])


def send_image(beamer,image):
    beamer.display_image(image)





