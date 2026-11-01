package com.example.demo.model;

import java.util.Set;

public final class Details {
    public static final Set<String> GENDERS = Set.of("Male", "Female", "Other");
    public static final Set<String> CITIES = Set.of(
            "Antipolo", "Bacolod", "Baguio", "Batangas City", "Butuan", "Cagayan de Oro", "Caloocan", "Cebu City", "Davao City",
            "Dumaguete", "Iloilo City", "Lapu-Lapu", "Las Piñas", "Legazpi", "Makati", "Malabon", "Mandaluyong", "Manila",
            "Muntinlupa", "Parañaque", "Pasay", "Pasig", "Quezon City", "San Fernando", "San Juan", "Taguig", "Zamboanga City"
    );
    public static final Set<String> CATEGORIES = Set.of("Concert", "Festival");
    public static final Set<String> POSITIVE_TRAITS = Set.of("Unforgettable", "Great Vibes", "Well Organized");
    public static final Set<String> NEGATIVE_TRAITS = Set.of("Overpriced", "Overcrowded", "Disorganized", "Underwhelming");
    public static final Set<String> TICKET_NAMES = Set.of("STANDARD", "VIP");

    private Details() {}
}