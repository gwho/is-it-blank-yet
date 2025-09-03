class Temperature:
    """Represents a temperature and keeps Celsius, Fahrenheit and Kelvin in sync."""

    ABSOLUTE_ZERO_C = -273.15  # degrees Celsius

    def __init__(self, celsius=0.0):
        # Store the temperature internally in Celsius
        self._celsius = None
        self.celsius = celsius

    @property
    def celsius(self):
        """Temperature in degrees Celsius."""
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < self.ABSOLUTE_ZERO_C:
            raise ValueError("Temperature cannot go below absolute zero")
        self._celsius = float(value)

    @property
    def fahrenheit(self):
        """Temperature in degrees Fahrenheit."""
        return self._celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        # Convert Fahrenheit to Celsius and assign through celsius property
        celsius_value = (float(value) - 32) * 5 / 9
        self.celsius = celsius_value

    @property
    def kelvin(self):
        """Temperature in Kelvin."""
        return self._celsius + 273.15

    @kelvin.setter
    def kelvin(self, value):
        # Convert Kelvin to Celsius and assign through celsius property
        celsius_value = float(value) - 273.15
        self.celsius = celsius_value

    def __repr__(self):
        return f"Temperature(celsius={self.celsius})"


if __name__ == "__main__":
    temp = Temperature(0)
    print("Default in Celsius:", temp.celsius)
    print("As Fahrenheit:", temp.fahrenheit)
    print("As Kelvin:", temp.kelvin)
    print("Setting Fahrenheit to 212")
    temp.fahrenheit = 212
    print("Now Celsius:", temp.celsius)
    print("Now Kelvin:", temp.kelvin)
