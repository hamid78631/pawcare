from llm import repondre

def main():
    historique = []
    print("🐾 Pawly — 'reset' pour recommencer, 'quit' pour quitter\n")


    while True : 
        message = input("Vous :")

        if not message.strip() :
            continue 
        if message == "quit":
            break
        if message == "reset" : 
            historique = []
            print("Historique réinitialisé.")
            continue
        reponse = repondre(message , historique)

        #Mémoriser l'échange pour le prochain tour 
        historique.append({"role":"user" , "content" : message})
        historique.append({"role":"assistant" , "content" : reponse})

        print(f"\nPawly : {reponse}\n")

if __name__ == "__main__":
    main()