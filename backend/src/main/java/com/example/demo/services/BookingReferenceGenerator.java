package com.example.demo.services;

import java.security.SecureRandom;

public final class BookingReferenceGenerator {
    private static final String ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
    private static final SecureRandom RANDOM = new SecureRandom();

    private BookingReferenceGenerator() {}

    public static String generate() {
        StringBuilder reference = new StringBuilder("EVX-");

        for (int i = 0; i < 12; i++) {
            if (i > 0 && i % 4 == 0) {
                reference.append("-");
            }

            reference.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }

        return reference.toString();
    }
}
