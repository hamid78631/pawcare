import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TermsPage.css';

export default function TermsPage() {
  return (
    <div className="terms">
      <Navbar />
      <div className="terms__container">
        <div className="terms__header">
          <h1 className="terms__title">Conditions d'utilisation</h1>
          <p className="terms__date">Dernière mise à jour : juin 2026</p>
        </div>

        <div className="terms__body">
          <section className="terms__section">
            <h2>1. Présentation du service</h2>
            <p>
              PawCare est une plateforme française de mise en relation entre propriétaires d'animaux
              (ci-après « Propriétaires ») et gardiens d'animaux de compagnie (ci-après « Sitters »).
              PawCare facilite la prise de contact et la gestion des réservations, mais n'intervient
              pas directement dans la prestation de garde.
            </p>
          </section>

          <section className="terms__section">
            <h2>2. Inscription et compte utilisateur</h2>
            <p>
              Pour accéder aux fonctionnalités de PawCare, vous devez créer un compte en fournissant
              des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos
              identifiants de connexion. Toute activité réalisée depuis votre compte est sous votre
              entière responsabilité.
            </p>
            <p>
              PawCare se réserve le droit de suspendre ou supprimer tout compte dont les informations
              s'avèrent inexactes, frauduleuses ou contraires aux présentes conditions.
            </p>
          </section>

          <section className="terms__section">
            <h2>3. Utilisation de la plateforme</h2>
            <p>
              En utilisant PawCare, vous vous engagez à :
            </p>
            <ul className="terms__list">
              <li>Fournir des informations véridiques sur vous-même et vos animaux</li>
              <li>Respecter les autres utilisateurs et leurs animaux</li>
              <li>Honorer les réservations confirmées</li>
              <li>Signaler tout incident ou problème dans les plus brefs délais</li>
              <li>Ne pas utiliser la plateforme à des fins illégales ou frauduleuses</li>
            </ul>
          </section>

          <section className="terms__section">
            <h2>4. Responsabilités des Sitters</h2>
            <p>
              Les Sitters s'engagent à prendre soin des animaux confiés avec la diligence requise,
              à maintenir leur profil à jour (disponibilités, tarifs, types d'animaux acceptés) et
              à informer le Propriétaire de tout incident concernant l'animal gardé.
            </p>
            <p>
              PawCare ne saurait être tenu responsable des dommages causés à ou par un animal
              pendant la période de garde. Il appartient aux parties de souscrire les assurances
              adaptées.
            </p>
          </section>

          <section className="terms__section">
            <h2>5. Responsabilités des Propriétaires</h2>
            <p>
              Les Propriétaires s'engagent à fournir des informations complètes et exactes sur
              leurs animaux (comportement, état de santé, vaccinations), à remettre à la garde
              un animal en bonne santé et à régler les réservations dans les conditions convenues.
            </p>
          </section>

          <section className="terms__section">
            <h2>6. Tarifs et paiements</h2>
            <p>
              Les tarifs affichés sur PawCare sont définis librement par chaque Sitter. Le prix
              total est calculé automatiquement en fonction de la durée de la réservation et du
              tarif journalier du Sitter. PawCare se réserve le droit d'introduire des frais de
              service dans le futur, après information préalable des utilisateurs.
            </p>
          </section>

          <section className="terms__section">
            <h2>7. Protection des données personnelles</h2>
            <p>
              PawCare collecte et traite vos données personnelles dans le respect du Règlement
              Général sur la Protection des Données (RGPD). Les données collectées (nom, prénom,
              email, ville) sont utilisées exclusivement pour le fonctionnement de la plateforme
              et ne sont jamais revendues à des tiers.
            </p>
            <p>
              Vous disposez d'un droit d'accès, de rectification et de suppression de vos données
              en nous contactant à l'adresse indiquée ci-dessous.
            </p>
          </section>

          <section className="terms__section">
            <h2>8. Modification des conditions</h2>
            <p>
              PawCare se réserve le droit de modifier les présentes conditions à tout moment.
              Les utilisateurs seront informés de toute modification substantielle par email.
              La poursuite de l'utilisation du service après modification vaut acceptation des
              nouvelles conditions.
            </p>
          </section>

          <section className="terms__section">
            <h2>9. Contact</h2>
            <p>
              Pour toute question relative aux présentes conditions ou à l'utilisation de la
              plateforme, vous pouvez nous contacter à :{' '}
              <a href="mailto:contact@pawcare.fr">contact@pawcare.fr</a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}