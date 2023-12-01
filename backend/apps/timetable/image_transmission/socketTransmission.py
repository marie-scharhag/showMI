from apps.timetable.image_transmission.abstract import BeamerInterface
import socket


class SocketBeamer(BeamerInterface):
    def __init__(self, ip_address, port):
        super().__init__(ip_address, port)
        self.socket = None

    def connect(self):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((self.ip_address, self.port))
        print(f"Socket-Connection to {self.ip_address}:{self.port}.")

    def display_image(self, image_data):
        if self.socket:
            self.socket.sendall(image_data.encode())
            print(f"Send data through Socket at {self.ip_address}:{self.port}: {image_data}")
        else:
            print("No Socket Connection.")

    def disconnect(self):
        if self.socket:
            self.socket.close()
            print("Connection lost")
        else:
            print("No connection.")