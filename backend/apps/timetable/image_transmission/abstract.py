from abc import ABC, abstractmethod


class BeamerInterface(ABC):
    def __init__(self, ip_address, port):
        self.ip_address = ip_address
        self.port = port

    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def display_image(self, data):
        pass
