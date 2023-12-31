import textwrap
from io import BytesIO

from PIL import Image, ImageDraw, ImageFont
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.http import HttpResponse
from django.views.decorators.cache import cache_page
from django.utils import timezone

from apps.timetable.models import Information
from backend.settings import BASE_DIR


def generate_lecture_image(lecture,room=None):
    """
    Generate an image representing the details of a lecture.

    Args:
    - lecture: The Lecture object for which the image is generated.
    - room: Optional Room object associated with the lecture.

    Returns:
    - BytesIO: A BytesIO object containing the PNG image data.
    """
    image = Image.new("RGB", (1920, 1080), "white")
    draw = ImageDraw.Draw(image)
    font_path = "fonts/Flama-Light.otf"
    statement_font = ImageFont.truetype(font_path, size=96)
    h1_font = ImageFont.truetype(font_path, size=64)
    h2_font = ImageFont.truetype(font_path, size=40)
    p_font = ImageFont.truetype(font_path, size=24)

    background = Image.open( f"{BASE_DIR}/static/images/Hochschule-RheinMain-Keyvisual-hellgruen_petrol_RGB.png")
    background = background.resize((1405, 1309))
    image.paste(background, (845, -129), background)

    teachers = get_user_model().objects.filter(lecture=lecture)
    name_string = ', '.join([f"{teacher.first_name} {teacher.last_name}" for teacher in teachers])

    current_time = timezone.now()
    infos = None
    if lecture.information:
        infos = Information.objects.filter(lecture=lecture)


    draw.text((168, 134), f"{lecture.start.strftime('%H:%M')} - {lecture.end.strftime('%H:%M')}",font=h2_font, fill="black")
    draw.text((168, 417), f"{lecture.lectureNr}", font=h2_font, fill="black")
    new_line = draw_wrapped_text(draw, f"{lecture.lectureName}", (168, 465), h1_font, 64)

    if new_line:
        y_coordinate = 628
        draw.text((168, 604), name_string, font=h2_font, fill="black")
        if infos:
            for info in infos:
                if current_time >= info.start and current_time <= info.end:
                    draw.text((168, y_coordinate), f"{info.info}", font=p_font, fill="black")
                    y_coordinate += 24
    else:
        y_coordinate = 628
        draw.text((168, 540), name_string, font=h2_font, fill="black")
        if infos:
            for info in infos:
                if current_time >= info.start and current_time <= info.end:
                    draw.text((168, y_coordinate), f"{info.info}", font=p_font, fill="black")
                    y_coordinate += 24
    if room:
        draw.text((1671, 899), f"{room.roomNr}", font=statement_font, fill="black")

    image_stream = BytesIO()
    image.save(image_stream, format="PNG")
    return image_stream


def draw_wrapped_text(draw, text, position, font, font_size):
    """
    Draw wrapped text on an image.

    Args:
    - draw: The ImageDraw object.
    - text: The text to be drawn.
    - position: Tuple representing the starting position (x, y) on the image.
    - font: The ImageFont object.
    - font_size: Font size for the text.

    Returns:
    - bool: True if the text is wrapped, False otherwise.
    """
    wrapped_text = textwrap.fill(text, width=40)
    lines = wrapped_text.splitlines()

    y = position[1]
    for line in lines:
        draw.text((position[0], y), line, font=font, fill="black")
        y += font_size

    if len(lines) > 1:
        return True
    else:
        return False


def generate_default_image(room):
    """
    Generate a default image for a room.

    Args:
    - room: The Room object for which the default image is generated.

    Returns:
    - BytesIO: A BytesIO object containing the PNG image data.
    """
    image = Image.new("RGB", (1920, 1080), "white")
    draw = ImageDraw.Draw(image)
    font_path = "fonts/Flama-Light.otf"
    statement_font = ImageFont.truetype(font_path, size=96)
    h1_font = ImageFont.truetype(font_path, size=64)
    h2_font = ImageFont.truetype(font_path, size=40)
    p_font = ImageFont.truetype(font_path, size=24)

    background = Image.open(f"{BASE_DIR}/static/images/Hochschule-RheinMain-Keyvisual-hellgruen_petrol_RGB.png")
    background = background.resize((1405, 1309))
    image.paste(background, (845, -129), background)

    draw.text((168, 465), f"Dieser Raum ist heute frei", font=h1_font, fill="black")
    draw.text((1671, 899), f"{room.roomNr}", font=statement_font, fill="black")

    image_stream = BytesIO()
    image.save(image_stream, format="PNG")

    return image_stream


@cache_page(60 * 15)
def cached_image(request,lecture,room=None):
    """
    View to serve a cached lecture image.

    Args:
    - request: The HTTP request.
    - lecture: The Lecture object.
    - room: Optional Room object associated with the lecture.

    Returns:
    - HttpResponse: The response containing the cached image data.
    """
    cache_key = f'image_{lecture.id}_{room.roomNr}' if room else f'image_{lecture.id}'
    cached_image_data = cache.get(cache_key)

    if not cached_image_data:
        image_stream = generate_lecture_image(lecture, room)
        image_data = image_stream.getvalue()
        cache.set(cache_key, image_data)
        return HttpResponse(image_data, content_type='image/png')
    else:
        return HttpResponse(cached_image_data, content_type='image/png')
