package com.big5.back.dto;

import java.util.Map;

public class OAuthAttributesDTO {
    private final Map<String, Object> attributes;
    private final String nameAttributeKey;
    private final String name;
    private final String email;
    private final String picture;
    private final String provider;
    private final String providerId;

    // 생성자
    public OAuthAttributesDTO(Map<String, Object> attributes, String nameAttributeKey, String name, String email, String picture, String provider, String providerId) {
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.provider = provider;
        this.providerId = providerId;
    }

    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public String getNameAttributeKey() {
        return nameAttributeKey;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPicture() {
        return picture;
    }

    public String getProvider() {
        return provider;
    }

    public String getProviderId() {
        return providerId;
    }
}
