#!/bin/sh
set -eu

cat > $KEYCLOAK_IMPORT << EOF
{
    "realm": "$KEYCLOAK_REALM",
    "enabled": true,
    "sslRequired": "external",
    "registrationAllowed": false,
    "requiredCredentials": [
        "password"
    ],
    "clients": [
        {
            "clientId": "$KEYCLOAK_CLIENT",
            "enabled": true,
            "secret": "$KEYCLOAK_SECRET",
            "redirectUris": [
                "https://$HOST_NAME/*"
            ]
        },
        {
            "clientId": "$KEYCLOAK_PUBLIC_CLIENT",
            "enabled": true,
            "publicClient": true,
            "redirectUris": [
                "https://$HOST_NAME/*"
            ]
        }
    ]
}
EOF

/opt/jboss/tools/docker-entrypoint.sh "$@"
