-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mar 17 Février 2015 à 19:18
-- Version du serveur :  5.6.21
-- Version de PHP :  5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `planning_scolaire`
--

-- --------------------------------------------------------

--
-- Structure de la table `anneescolaire`
--

CREATE TABLE IF NOT EXISTS `anneescolaire` (
  `Id` int(11) NOT NULL,
  `DateDebut` date DEFAULT NULL,
  `DateFin` date DEFAULT NULL,
  `Nom` varchar(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `demiejournee`
--

CREATE TABLE IF NOT EXISTS `demiejournee` (
  `IdDemieJournee` int(11) NOT NULL,
  `IdJour` int(11) DEFAULT NULL,
  `IdSemaine` int(11) DEFAULT NULL,
  `Moment` varchar(10) DEFAULT NULL,
  `Fermee` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `demiejourneedispo`
--

CREATE TABLE IF NOT EXISTS `demiejourneedispo` (
  `IdEnseignant` int(11) DEFAULT NULL,
  `IdDemieJournee` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `jour`
--

CREATE TABLE IF NOT EXISTS `jour` (
  `IdJour` int(11) NOT NULL,
  `NomDuJour` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `semaine`
--

CREATE TABLE IF NOT EXISTS `semaine` (
  `IdSemaine` int(11) NOT NULL,
  `IdAnnee` int(11) DEFAULT NULL,
  `DateDebut` date DEFAULT NULL,
  `DateFin` date DEFAULT NULL,
  `NoSemaine` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `anneescolaire`
--
ALTER TABLE `anneescolaire`
 ADD PRIMARY KEY (`Id`);

--
-- Index pour la table `demiejournee`
--
ALTER TABLE `demiejournee`
 ADD PRIMARY KEY (`IdDemieJournee`), ADD KEY `IdSemaine` (`IdSemaine`), ADD KEY `IdJour` (`IdJour`);

--
-- Index pour la table `demiejourneedispo`
--
ALTER TABLE `demiejourneedispo`
 ADD KEY `IdDemieJournee` (`IdDemieJournee`);

--
-- Index pour la table `jour`
--
ALTER TABLE `jour`
 ADD PRIMARY KEY (`IdJour`);

--
-- Index pour la table `semaine`
--
ALTER TABLE `semaine`
 ADD PRIMARY KEY (`IdSemaine`), ADD KEY `IdAnnee` (`IdAnnee`);

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `demiejournee`
--
ALTER TABLE `demiejournee`
ADD CONSTRAINT `demiejournee_ibfk_1` FOREIGN KEY (`IdSemaine`) REFERENCES `semaine` (`IdSemaine`),
ADD CONSTRAINT `demiejournee_ibfk_2` FOREIGN KEY (`IdJour`) REFERENCES `jour` (`IdJour`);

--
-- Contraintes pour la table `demiejourneedispo`
--
ALTER TABLE `demiejourneedispo`
ADD CONSTRAINT `demiejourneedispo_ibfk_1` FOREIGN KEY (`IdDemieJournee`) REFERENCES `demiejournee` (`IdDemieJournee`);

--
-- Contraintes pour la table `semaine`
--
ALTER TABLE `semaine`
ADD CONSTRAINT `semaine_ibfk_1` FOREIGN KEY (`IdAnnee`) REFERENCES `anneescolaire` (`Id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
