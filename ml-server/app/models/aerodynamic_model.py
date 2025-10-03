import numpy as np
import math
from typing import Dict

class AerodynamicModel:
    def __init__(self):
        self.air_density_sea_level = 1.225  # kg/m³
        self.temperature_lapse_rate = 0.0065  # K/m
        self.temperature_sea_level = 288.15  # K

    def calculate_air_density(self, altitude: float) -> float:
        temperature = self.temperature_sea_level - (self.temperature_lapse_rate * altitude)
        pressure_ratio = (temperature / self.temperature_sea_level) ** 5.2561
        return self.air_density_sea_level * pressure_ratio

    def calculate_lift_coefficient(self, angle_of_attack: float, aircraft_type: str = "generic") -> float:
        angle_rad = math.radians(angle_of_attack)

        if aircraft_type == "light_aircraft":
            cl_alpha = 6.2  # per radian
            cl_0 = 0.3
        elif aircraft_type == "commercial":
            cl_alpha = 5.8
            cl_0 = 0.2
        else:
            cl_alpha = 6.0
            cl_0 = 0.25

        cl = cl_0 + cl_alpha * angle_rad

        stall_angle = math.radians(15)
        if abs(angle_rad) > stall_angle:
            cl *= 0.7  # Reduced lift after stall

        return max(min(cl, 1.8), -1.2)

    def calculate_drag_coefficient(self, angle_of_attack: float, lift_coefficient: float) -> float:
        cd_0 = 0.02  # Parasitic drag coefficient
        k = 0.04     # Induced drag factor

        cd_induced = k * (lift_coefficient ** 2)

        angle_rad = math.radians(abs(angle_of_attack))
        cd_pressure = 0.1 * (angle_rad ** 2)

        return cd_0 + cd_induced + cd_pressure

    def calculate_pressure_coefficient(self, velocity: float, angle_of_attack: float) -> float:
        dynamic_pressure = 0.5 * 1.225 * (velocity ** 2)

        angle_factor = 1 + 0.5 * math.sin(math.radians(angle_of_attack * 2))
        velocity_factor = min(velocity / 100.0, 2.0)

        cp = angle_factor * velocity_factor * 0.8
        return max(min(cp, 2.0), -1.5)

    def predict(self, velocity: float, angle_of_attack: float, altitude: float,
                wing_span: float, wing_area: float, aircraft_type: str = "generic") -> Dict[str, float]:

        air_density = self.calculate_air_density(altitude)
        dynamic_pressure = 0.5 * air_density * (velocity ** 2)

        cl = self.calculate_lift_coefficient(angle_of_attack, aircraft_type)
        cd = self.calculate_drag_coefficient(angle_of_attack, cl)
        cp = self.calculate_pressure_coefficient(velocity, angle_of_attack)

        lift_force = cl * dynamic_pressure * wing_area
        drag_force = cd * dynamic_pressure * wing_area

        confidence_score = self._calculate_confidence(velocity, angle_of_attack, altitude)

        return {
            "lift_coefficient": round(cl, 4),
            "drag_coefficient": round(cd, 4),
            "pressure_coefficient": round(cp, 4),
            "lift_force": round(lift_force, 2),
            "drag_force": round(drag_force, 2),
            "confidence_score": round(confidence_score, 3)
        }

    def _calculate_confidence(self, velocity: float, angle_of_attack: float, altitude: float) -> float:
        confidence = 1.0

        if velocity < 10 or velocity > 300:
            confidence *= 0.7
        if abs(angle_of_attack) > 20:
            confidence *= 0.6
        if altitude > 15000:
            confidence *= 0.8

        noise_factor = np.random.normal(0, 0.02)
        confidence = max(min(confidence + noise_factor, 1.0), 0.3)

        return confidence