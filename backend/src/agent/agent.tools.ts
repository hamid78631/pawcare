import OpenAI from "openai";

export const TOOLS : OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
        type : "function",
        function : {
            name : "search_sitters" ,
            description : "Recherches des pet_sitters disponibles sur la platforme pawcare, filtrés par ville  et/ou type d'animal accepté .Utilise cet dès qu'un visiteur ou propriétaire cherche un sitter . ",
            parameters : {
                type : "object",
                properties : {
                    city : {
                        type : 'string',
                        description :'Ville recherchée , ex : "Lyon" .optionnel.',
                    },
                    animal_type : {
                        type : "string",
                        enum : ["dog" , "cat" , "other"],
                        description : "Type d'animal accepté par le pet sitter . optionnel.",

                    },

                }
            }
        }
    },

    {
        type : "function",
        function : {
            name : "get_sitter_details",
            description : "Récupère les détails d'un pet sitter spécifique .Utilise cet outil lorsqu'un visiteur ou propriétaire souhaite obtenir des informations sur un sitter particulier .",
            parameters : {
                type : "object",
                properties : {
                    sitter_id : {
                        type : "number",
                        description : "ID du profil sitter dont on veut récupérer les détails (id du profil renvoyé par search_sitters, pas l'id user) ."
                    }
                },
                required : ["sitter_id"]
            }
        }
    },
    {
        type : "function",
        function : {
            name : "list_my_animals",
            description : "Récupère la liste des animaux du propriétaire actuellement connecté .Utilise cet outil lorsqu'un propriétaire souhaite voir tous ses animaux enregistrés sur la plateforme .",
            parameters : {
                type : "object",
                properties : {}
            }
        }
    },
    {
        type : "function",
        function : {
            name : "create_booking",
            description : "Crée une réservation pour un animal du propriétaire connecté auprès d'un pet sitter .Utilise cet outil uniquement après avoir confirmé avec l'utilisateur le sitter, l'animal et les dates choisies .",
            parameters : {
                type : "object",
                properties : {
                    sitter_user_id : {
                        type : "number",
                        description : "ID utilisateur (userId) du sitter — attention, ce n'est PAS l'id du profil sitter (sitter_id) utilisé par get_sitter_details, mais l'id user qu'il contient ."
                    },
                    animal_id : {
                        type : "number",
                        description : "ID de l'animal du propriétaire pour lequel la réservation est faite ."
                    },
                    start_date : {
                        type : "string",
                        description : "Date de début de la garde, format YYYY-MM-DD ."
                    },
                    end_date : {
                        type : "string",
                        description : "Date de fin de la garde, format YYYY-MM-DD ."
                    },
                    message : {
                        type : "string",
                        description : "Message optionnel du propriétaire pour le sitter ."
                    }
                },
                required : ["sitter_user_id", "animal_id", "start_date", "end_date"]
            }
        }
    }
];
