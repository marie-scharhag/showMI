from abc import ABC, abstractmethod


class BeamerInterface(ABC):
    """
    Abstract base class for Beamer interfaces.

    This class defines an interface for interacting with a projector or beamer device.
    Subclasses must implement the 'connect' and 'display_image' methods.

    Attributes:
    - ip_address (str): The IP address of the beamer device.
    - port (str): The port number for communication with the beamer device.

    Methods:
    - connect(): Abstract method to establish a connection with the beamer device.
    - display_image(data): Abstract method to display an image on the beamer device.

    """
    def __init__(self, ip_address, port):
        """
        Initializes a BeamerInterface instance.

        Args:
        - ip_address (str): The IP address of the beamer device.
        - port (str): The port number for communication with the beamer device.
        """
        self.ip_address = ip_address
        self.port = port

    @abstractmethod
    def connect(self):
        """
        Abstract method to establish a connection with the beamer device.
        This method should be implemented by subclasses.
        """
        pass

    @abstractmethod
    def display_image(self, data):
        """
        Abstract method to display an image on the beamer device.
        This method should be implemented by subclasses.

        Args:
        - data: The image data to be displayed on the beamer device.
        """
        pass
