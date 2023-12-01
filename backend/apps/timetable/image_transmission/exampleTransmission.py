from apps.timetable.image_transmission.abstract import BeamerInterface


class ExampleBeamer(BeamerInterface):
    def __init__(self, ip_address, port):
        super().__init__(ip_address, port)
        self.connected = False

    def connect(self):
        self.connected = True
        print(f"Connection to Beamer at {self.ip_address}:{self.port}.")

    def display_image(self, image_data):
        if self.connected:
            print(f"Send data at {self.ip_address}:{self.port}: {image_data}")
        else:
            print("No Connection.")

    def disconnect(self):
        if self.connected:
            self.connected = False
            print("Connection lost")
        else:
            print("No connection.")