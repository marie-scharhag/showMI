from abc import ABC, abstractmethod


class TimetableLoader(ABC):
    """
    An abstract base class for loading timetable data.

    Attributes:
        data_source: The source from which timetable data will be loaded.
    """
    @abstractmethod
    def load_timetable_data(self, data_source):
        """
        Abstract method to load timetable data.

        Args:
            data_source: The source from which timetable data will be loaded.
        """
        pass
