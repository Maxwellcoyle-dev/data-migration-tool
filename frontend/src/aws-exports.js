/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

const awsmobile = {
    "aws_project_region": "us-east-2",
    "aws_cognito_identity_pool_id": "us-east-2:35559172-cccb-4da4-9095-c44a89af666f",
    "aws_cognito_region": "us-east-2",
    "aws_user_pools_id": "us-east-2_nBIcbqukb",
    "aws_user_pools_web_client_id": "7ejfnpn65ke5hnetjr3q01m9v7",
    "oauth": {
        "domain": "trainicity-data-migration-dev.auth.us-east-2.amazoncognito.com",
        "scope": [
            "phone",
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        "redirectSignIn": "https://migration.trainicity.com/,http://localhost:3000/",
        "redirectSignOut": "http://localhost:3000/,https://migration.trainicity.com/",
        "responseType": "code"
    },
    "federationTarget": "COGNITO_USER_POOLS",
    "aws_cognito_username_attributes": [
        "EMAIL"
    ],
    "aws_cognito_social_providers": [
        "GOOGLE"
    ],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ]
};


export default awsmobile;
