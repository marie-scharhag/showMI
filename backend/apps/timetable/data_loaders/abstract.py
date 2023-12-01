from abc import ABC, abstractmethod


class TimetableLoader(ABC):
    @abstractmethod
    def load_timetable_data(self, data_source):
        pass
