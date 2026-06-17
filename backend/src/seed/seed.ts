import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { SitterProfileService } from '../sitter-profile/sitter-profile.service';
import { AnimalsService } from '../animals/animals.service';
import { acceptedAnimalTypes } from '../sitter-profile/entities/sitter-profile.entity';
import { AnimalType } from '../animals/entities/animal.entity';

const sitters = [
  {
    firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@pawcare-seed.com',
    password: 'Test1234', city: 'Paris',
    bio: "Passionnée d'animaux depuis l'enfance, je propose une garde chaleureuse dans mon appartement parisien. Vos compagnons sont entre de bonnes mains !",
    hourlyRate: 28, acceptedAnimalTypes: [acceptedAnimalTypes.DOG, acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Luna', species: AnimalType.DOG, breed: 'Labrador', age: 3, description: 'Très sociable et joueur' },
      { name: 'Minou', species: AnimalType.CAT, breed: 'Persan', age: 5, description: 'Calme et affectueux' },
    ],
  },
  {
    firstName: 'Thomas', lastName: 'Martin', email: 'thomas.martin@pawcare-seed.com',
    password: 'Test1234', city: 'Lyon',
    bio: "Éducateur canin bénévole et amoureux des chiens. Grande maison avec jardin, promenades quotidiennes garanties.",
    hourlyRate: 25, acceptedAnimalTypes: [acceptedAnimalTypes.DOG],
    animals: [
      { name: 'Rex', species: AnimalType.DOG, breed: 'Berger Allemand', age: 4, description: 'Obéissant et protecteur' },
      { name: 'Max', species: AnimalType.DOG, breed: 'Golden Retriever', age: 2, description: 'Adorable et joueur' },
    ],
  },
  {
    firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@pawcare-seed.com',
    password: 'Test1234', city: 'Marseille',
    bio: "Propriétaire de deux chats, je comprends leurs besoins mieux que personne. Votre félin sera dorloté comme un roi.",
    hourlyRate: 20, acceptedAnimalTypes: [acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Simba', species: AnimalType.CAT, breed: 'Maine Coon', age: 6, description: 'Grand et majestueux' },
      { name: 'Noisette', species: AnimalType.CAT, breed: 'Européen', age: 3, description: 'Curieux et espiègle' },
    ],
  },
  {
    firstName: 'Pierre', lastName: 'Leroy', email: 'pierre.leroy@pawcare-seed.com',
    password: 'Test1234', city: 'Toulouse',
    bio: "Ancien éleveur reconverti, j'accueille tous types d'animaux avec professionnalisme. Grand espace vert disponible.",
    hourlyRate: 30, acceptedAnimalTypes: [acceptedAnimalTypes.DOG, acceptedAnimalTypes.CAT, acceptedAnimalTypes.OTHER],
    animals: [
      { name: 'Rocky', species: AnimalType.DOG, breed: 'Boxer', age: 3, description: 'Énergique et affectueux' },
      { name: 'Félix', species: AnimalType.CAT, breed: 'Siamois', age: 4, description: 'Élégant et bavard' },
      { name: 'Bunny', species: AnimalType.OTHER, breed: 'Lapin nain', age: 2, description: 'Doux et timide' },
    ],
  },
  {
    firstName: 'Emma', lastName: 'Moreau', email: 'emma.moreau@pawcare-seed.com',
    password: 'Test1234', city: 'Nice',
    bio: "Étudiante en médecine vétérinaire, passionnée par le bien-être animal. Vos chats seront entre des mains expertes.",
    hourlyRate: 22, acceptedAnimalTypes: [acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Pixel', species: AnimalType.CAT, breed: 'Ragdoll', age: 2, description: 'Doux comme un jouet en peluche' },
    ],
  },
  {
    firstName: 'Lucas', lastName: 'Simon', email: 'lucas.simon@pawcare-seed.com',
    password: 'Test1234', city: 'Nantes',
    bio: "Fan de randonnées avec mon Labrador, je propose des gardes actives pour les chiens qui ont besoin d'exercice. Parc à proximité.",
    hourlyRate: 26, acceptedAnimalTypes: [acceptedAnimalTypes.DOG],
    animals: [
      { name: 'Charlie', species: AnimalType.DOG, breed: 'Labrador', age: 5, description: 'Sportif et fidèle' },
    ],
  },
  {
    firstName: 'Chloé', lastName: 'Michel', email: 'chloe.michel@pawcare-seed.com',
    password: 'Test1234', city: 'Bordeaux',
    bio: "Télétravailleuse à domicile, vos animaux ne seront jamais seuls ! Présence, jeux et affection tout au long de la journée.",
    hourlyRate: 32, acceptedAnimalTypes: [acceptedAnimalTypes.DOG, acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Bella', species: AnimalType.DOG, breed: 'Cavalier King Charles', age: 4, description: 'Câline et douce' },
      { name: 'Caramel', species: AnimalType.CAT, breed: 'Angora', age: 3, description: 'Joueuse et curieuse' },
    ],
  },
  {
    firstName: 'Maxime', lastName: 'Garnier', email: 'maxime.garnier@pawcare-seed.com',
    password: 'Test1234', city: 'Strasbourg',
    bio: "Propriétaire d'un Golden Retriever, j'adore accueillir d'autres chiens pour des jeux et promenades dans les parcs strasbourgeois.",
    hourlyRate: 24, acceptedAnimalTypes: [acceptedAnimalTypes.DOG],
    animals: [
      { name: 'Thor', species: AnimalType.DOG, breed: 'Golden Retriever', age: 6, description: 'Très sociable avec les autres chiens' },
    ],
  },
  {
    firstName: 'Camille', lastName: 'Rousseau', email: 'camille.rousseau@pawcare-seed.com',
    password: 'Test1234', city: 'Rennes',
    bio: "Douce et patiente, je propose une garde calme et sereine pour les chats anxieux ou seniors. Appartement sécurisé.",
    hourlyRate: 18, acceptedAnimalTypes: [acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Lola', species: AnimalType.CAT, breed: 'Britannique à poil court', age: 7, description: 'Senior tranquille et affectueuse' },
      { name: 'Tigrou', species: AnimalType.CAT, breed: 'Européen tigré', age: 2, description: 'Joueur mais timide' },
    ],
  },
  {
    firstName: 'Antoine', lastName: 'Petit', email: 'antoine.petit@pawcare-seed.com',
    password: 'Test1234', city: 'Montpellier',
    bio: "Jardin clôturé de 500m², idéal pour les grands chiens. Expérience avec des animaux atypiques comme les reptiles et rongeurs.",
    hourlyRate: 27, acceptedAnimalTypes: [acceptedAnimalTypes.DOG, acceptedAnimalTypes.OTHER],
    animals: [
      { name: 'Nala', species: AnimalType.DOG, breed: 'Husky', age: 3, description: 'Énergique et aventurière' },
      { name: 'Tweety', species: AnimalType.OTHER, breed: 'Perroquet', age: 8, description: 'Bavard et attachant' },
    ],
  },
  {
    firstName: 'Laura', lastName: 'Vincent', email: 'laura.vincent@pawcare-seed.com',
    password: 'Test1234', city: 'Lille',
    bio: "Ancienne assistante vétérinaire, habituée à gérer les animaux malades ou sous traitement. Soins médicaux possibles.",
    hourlyRate: 23, acceptedAnimalTypes: [acceptedAnimalTypes.DOG, acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Mia', species: AnimalType.DOG, breed: 'Beagle', age: 4, description: 'Curieuse et gourmande' },
      { name: 'Misty', species: AnimalType.CAT, breed: 'Chartreux', age: 5, description: 'Discrète et indépendante' },
    ],
  },
  {
    firstName: 'Julien', lastName: 'Fontaine', email: 'julien.fontaine@pawcare-seed.com',
    password: 'Test1234', city: 'Grenoble',
    bio: "Sportif passionné, je propose des promenades en montagne pour les chiens aventuriers. Votre compagnon rentrera épanoui !",
    hourlyRate: 29, acceptedAnimalTypes: [acceptedAnimalTypes.DOG],
    animals: [
      { name: 'Scout', species: AnimalType.DOG, breed: 'Border Collie', age: 2, description: 'Intelligent et infatigable' },
    ],
  },
  {
    firstName: 'Manon', lastName: 'Girard', email: 'manon.girard@pawcare-seed.com',
    password: 'Test1234', city: 'Tours',
    bio: "Animatrice nature et passionnée de petits animaux. J'accueille chats, lapins, cochons d'Inde et autres NAC.",
    hourlyRate: 21, acceptedAnimalTypes: [acceptedAnimalTypes.CAT, acceptedAnimalTypes.OTHER],
    animals: [
      { name: 'Cannelle', species: AnimalType.CAT, breed: 'Abyssin', age: 3, description: 'Très active et joueuse' },
      { name: 'Peanut', species: AnimalType.OTHER, breed: 'Cochon d\'Inde', age: 1, description: 'Doux et sociable' },
    ],
  },
  {
    firstName: 'Romain', lastName: 'Lefebvre', email: 'romain.lefebvre@pawcare-seed.com',
    password: 'Test1234', city: 'Rouen',
    bio: "Je travaille de chez moi, vos chiens ne seront jamais seuls. Promenade matin et soir incluse, câlins garantis.",
    hourlyRate: 25, acceptedAnimalTypes: [acceptedAnimalTypes.DOG],
    animals: [
      { name: 'Duke', species: AnimalType.DOG, breed: 'Dalmatien', age: 3, description: 'Plein d\'énergie et très affectueux' },
    ],
  },
  {
    firstName: 'Inès', lastName: 'Bonnet', email: 'ines.bonnet@pawcare-seed.com',
    password: 'Test1234', city: 'Paris',
    bio: "Grand appartement avec jardin partagé à Paris. J'accueille vos animaux avec tout l'amour qu'ils méritent.",
    hourlyRate: 35, acceptedAnimalTypes: [acceptedAnimalTypes.DOG, acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Coco', species: AnimalType.DOG, breed: 'Bichon frisé', age: 4, description: 'Adorable et très propre' },
      { name: 'Léo', species: AnimalType.CAT, breed: 'Bengal', age: 2, description: 'Actif et très curieux' },
    ],
  },
  {
    firstName: 'Fatima', lastName: 'Benali', email: 'fatima.benali@pawcare-seed.com',
    password: 'Test1234', city: 'Casablanca',
    bio: "Amoureuse des animaux depuis toujours, je propose une garde attentive dans un cadre familial chaleureux à Casablanca.",
    hourlyRate: 15, acceptedAnimalTypes: [acceptedAnimalTypes.DOG, acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Zara', species: AnimalType.DOG, breed: 'Caniche', age: 3, description: 'Intelligente et très obéissante' },
      { name: 'Layla', species: AnimalType.CAT, breed: 'Persane', age: 4, description: 'Calme et très affectueuse' },
    ],
  },
  {
    firstName: 'Youssef', lastName: 'El Mansouri', email: 'youssef.elmansouri@pawcare-seed.com',
    password: 'Test1234', city: 'Rabat',
    bio: "Grande terrasse sécurisée à Rabat. Sorties quotidiennes dans les parcs de la ville pour les chiens actifs.",
    hourlyRate: 18, acceptedAnimalTypes: [acceptedAnimalTypes.DOG],
    animals: [
      { name: 'Saad', species: AnimalType.DOG, breed: 'Sloughi', age: 5, description: 'Rapide et élégant, race marocaine' },
    ],
  },
  {
    firstName: 'Khadija', lastName: 'Rachidi', email: 'khadija.rachidi@pawcare-seed.com',
    password: 'Test1234', city: 'Marrakech',
    bio: "Propriétaire de trois chats persans, je connais parfaitement leurs habitudes. Votre félin sera comme chez lui à Marrakech.",
    hourlyRate: 12, acceptedAnimalTypes: [acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Sultane', species: AnimalType.CAT, breed: 'Persan', age: 3, description: 'Majestueuse et douce' },
      { name: 'Jade', species: AnimalType.CAT, breed: 'Persan', age: 5, description: 'Silencieuse et câline' },
      { name: 'Rose', species: AnimalType.CAT, breed: 'Persan', age: 2, description: 'Joueuse et curieuse' },
    ],
  },
  {
    firstName: 'Mehdi', lastName: 'Ouali', email: 'mehdi.ouali@pawcare-seed.com',
    password: 'Test1234', city: 'Fès',
    bio: "Vétérinaire en clinique privée à Fès. Garde professionnelle pour tous types d'animaux, suivi médical inclus si nécessaire.",
    hourlyRate: 16, acceptedAnimalTypes: [acceptedAnimalTypes.DOG, acceptedAnimalTypes.CAT, acceptedAnimalTypes.OTHER],
    animals: [
      { name: 'Atlas', species: AnimalType.DOG, breed: 'Berger marocain', age: 4, description: 'Robuste et loyal' },
      { name: 'Sheba', species: AnimalType.CAT, breed: 'Abyssin', age: 3, description: 'Vive et intelligente' },
      { name: 'Coco', species: AnimalType.OTHER, breed: 'Perroquet gris', age: 10, description: 'Parle et chante en darija' },
    ],
  },
  {
    firstName: 'Amina', lastName: 'Tazi', email: 'amina.tazi@pawcare-seed.com',
    password: 'Test1234', city: 'Agadir',
    bio: "Villa avec jardin à Agadir, présence 24h/24 garantie. Spécialisée dans les NAC et les chats.",
    hourlyRate: 14, acceptedAnimalTypes: [acceptedAnimalTypes.CAT, acceptedAnimalTypes.OTHER],
    animals: [
      { name: 'Safi', species: AnimalType.CAT, breed: 'Européen', age: 2, description: 'Libre et indépendant' },
      { name: 'Hamza', species: AnimalType.OTHER, breed: 'Tortue', age: 15, description: 'Vieux sage de la maison' },
    ],
  },
  {
    firstName: 'Hassan', lastName: 'Berrada', email: 'hassan.berrada@pawcare-seed.com',
    password: 'Test1234', city: 'Tanger',
    bio: "Retraité passionné de canins, je propose des gardes longue durée. Promenades bord de mer incluses pour vos chiens.",
    hourlyRate: 17, acceptedAnimalTypes: [acceptedAnimalTypes.DOG],
    animals: [
      { name: 'Barka', species: AnimalType.DOG, breed: 'Labrador', age: 6, description: 'Très calme, idéal pour les familles' },
    ],
  },
  {
    firstName: 'Nadia', lastName: 'Cherkaoui', email: 'nadia.cherkaoui@pawcare-seed.com',
    password: 'Test1234', city: 'Casablanca',
    bio: "Éducatrice spécialisée en comportement animal. Je prends en charge les chiens difficiles ou anxieux avec méthodes positives.",
    hourlyRate: 20, acceptedAnimalTypes: [acceptedAnimalTypes.DOG, acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Zorro', species: AnimalType.DOG, breed: 'Malinois', age: 3, description: 'Intelligent et très entraînable' },
      { name: 'Mirage', species: AnimalType.CAT, breed: 'Sphynx', age: 4, description: 'Unique et très attachant' },
    ],
  },
  {
    firstName: 'Omar', lastName: 'Lahlou', email: 'omar.lahlou@pawcare-seed.com',
    password: 'Test1234', city: 'Rabat',
    bio: "Grand appartement calme à Rabat avec espace dédié. Votre chien profitera de l'attention d'un vrai passionné.",
    hourlyRate: 15, acceptedAnimalTypes: [acceptedAnimalTypes.DOG],
    animals: [
      { name: 'Amine', species: AnimalType.DOG, breed: 'Teckel', age: 4, description: 'Petit mais courageux' },
    ],
  },
  {
    firstName: 'Rim', lastName: 'Alami', email: 'rim.alami@pawcare-seed.com',
    password: 'Test1234', city: 'Marrakech',
    bio: "Télétravailleuse dans un riad calme de Marrakech. Présente toute la journée pour chouchouter votre félin.",
    hourlyRate: 13, acceptedAnimalTypes: [acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Sakura', species: AnimalType.CAT, breed: 'Japonais', age: 3, description: 'Élégant et discret' },
      { name: 'Mochi', species: AnimalType.CAT, breed: 'Scottisch Fold', age: 2, description: 'Petites oreilles, grand cœur' },
    ],
  },
  {
    firstName: 'Karim', lastName: 'Benkirane', email: 'karim.benkirane@pawcare-seed.com',
    password: 'Test1234', city: 'Casablanca',
    bio: "Habitué à gérer plusieurs animaux simultanément, je propose un cadre serein et structuré pour tous vos compagnons.",
    hourlyRate: 19, acceptedAnimalTypes: [acceptedAnimalTypes.DOG, acceptedAnimalTypes.CAT, acceptedAnimalTypes.OTHER],
    animals: [
      { name: 'Pasha', species: AnimalType.DOG, breed: 'Samoyède', age: 2, description: 'Blanc comme neige et adorable' },
      { name: 'Zizi', species: AnimalType.CAT, breed: 'Chartreux', age: 5, description: 'Gros ronronneurs' },
      { name: 'Kiki', species: AnimalType.OTHER, breed: 'Lapin angora', age: 3, description: 'Très doux et facile à vivre' },
    ],
  },
  {
    firstName: 'Léa', lastName: 'Marchand', email: 'lea.marchand@pawcare-seed.com',
    password: 'Test1234', city: 'Lyon',
    bio: "Kinésithérapeute animalière, je propose une garde active avec massages relaxants pour chiens sportifs ou seniors.",
    hourlyRate: 26, acceptedAnimalTypes: [acceptedAnimalTypes.DOG],
    animals: [
      { name: 'Pompon', species: AnimalType.DOG, breed: 'Caniche royal', age: 7, description: 'Senior élégant et doux' },
    ],
  },
  {
    firstName: 'Hugo', lastName: 'Perrin', email: 'hugo.perrin@pawcare-seed.com',
    password: 'Test1234', city: 'Marseille',
    bio: "Biologiste marin, j'adore les animaux atypiques. Chats et NAC bienvenus dans mon appartement calme face à la mer.",
    hourlyRate: 22, acceptedAnimalTypes: [acceptedAnimalTypes.CAT, acceptedAnimalTypes.OTHER],
    animals: [
      { name: 'Moby', species: AnimalType.CAT, breed: 'Maine Coon', age: 4, description: 'Grand, majestueux, très doux' },
      { name: 'Nemo', species: AnimalType.OTHER, breed: 'Poisson combattant', age: 1, description: 'Coloré et fascinant' },
    ],
  },
  {
    firstName: 'Céline', lastName: 'Dupuis', email: 'celine.dupuis@pawcare-seed.com',
    password: 'Test1234', city: 'Bordeaux',
    bio: "Maman de deux labradors et deux chats, ma maison est un sanctuaire pour animaux. Je les traite comme ma famille.",
    hourlyRate: 31, acceptedAnimalTypes: [acceptedAnimalTypes.DOG, acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Choco', species: AnimalType.DOG, breed: 'Labrador chocolat', age: 3, description: 'Gourmand et affectueux' },
      { name: 'Vanille', species: AnimalType.DOG, breed: 'Labrador jaune', age: 5, description: 'Douce et très patiente' },
      { name: 'Réglisse', species: AnimalType.CAT, breed: 'Noir européen', age: 4, description: 'Mystérieux et indépendant' },
    ],
  },
  {
    firstName: 'Sana', lastName: 'El Idrissi', email: 'sana.elidrissi@pawcare-seed.com',
    password: 'Test1234', city: 'Meknès',
    bio: "Enseignante avec emploi du temps flexible, disponible en semaine et week-ends. Promenades dans les parcs de Meknès.",
    hourlyRate: 14, acceptedAnimalTypes: [acceptedAnimalTypes.DOG],
    animals: [
      { name: 'Warda', species: AnimalType.DOG, breed: 'Spitz nain', age: 2, description: 'Petite, vive et adorable' },
    ],
  },
  {
    firstName: 'Yassine', lastName: 'Alaoui', email: 'yassine.alaoui@pawcare-seed.com',
    password: 'Test1234', city: 'Fès',
    bio: "Artiste peintre travaillant de chez moi, vos chats seront mes fidèles compagnons. Calme et tendresse garantis à Fès.",
    hourlyRate: 12, acceptedAnimalTypes: [acceptedAnimalTypes.CAT],
    animals: [
      { name: 'Azur', species: AnimalType.CAT, breed: 'Russe bleu', age: 3, description: 'Silencieux et élégant' },
    ],
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const sitterProfileService = app.get(SitterProfileService);
  const animalsService = app.get(AnimalsService);

  console.log('🌱 Début du seeding — 30 sitters + animaux...\n');

  for (const sitter of sitters) {
    try {
      const user = await authService.register({
        firstName: sitter.firstName,
        lastName: sitter.lastName,
        email: sitter.email,
        password: sitter.password,
        role: 'sitter' as any,
        city: sitter.city,
      });

      await sitterProfileService.create({
        bio: sitter.bio,
        hourlyRate: sitter.hourlyRate,
        city: sitter.city,
        acceptedAnimalTypes: sitter.acceptedAnimalTypes,
      }, user.id);

      for (const animal of sitter.animals) {
        await animalsService.create(animal, user.id);
      }

      const animalNames = sitter.animals.map(a => a.name).join(', ');
      console.log(`✅ ${sitter.firstName} ${sitter.lastName} (${sitter.city}) — animaux: ${animalNames}`);
    } catch (err: any) {
      console.warn(`⚠️  Ignoré (${sitter.email}) : ${err?.message}`);
    }
  }

  console.log('\n✅ Seeding terminé !');
  await app.close();
}

seed();
