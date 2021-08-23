-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 17 aug 2021 om 15:43
-- Serverversie: 10.4.20-MariaDB
-- PHP-versie: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `broodjesbar`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bestellingen`
--

CREATE TABLE `bestellingen` (
  `id` int(11) NOT NULL,
  `broodjeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `datum` datetime NOT NULL,
  `prijs` decimal(10,2) NOT NULL,
  `status` int(2) NOT NULL,
  `betaald` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `bestellingen`
--

INSERT INTO `bestellingen` (`id`, `broodjeId`, `userId`, `datum`, `prijs`, `status`, `betaald`) VALUES
(41, 6, 14, '2021-08-13 15:14:17', '3.50', 1, 0),
(42, 4, 14, '2021-08-13 15:29:30', '3.50', 1, 0),
(43, 8, 14, '2021-08-13 15:29:34', '3.90', 1, 0),
(44, 19, 14, '2021-08-13 16:58:01', '3.70', 1, 0),
(45, 11, 14, '2021-08-13 18:44:41', '4.00', 1, 0),
(46, 6, 17, '2021-08-15 20:43:47', '3.50', 1, 0);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bestelstatus`
--

CREATE TABLE `bestelstatus` (
  `id` int(11) NOT NULL,
  `omschrijving` varchar(80) CHARACTER SET latin1 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `bestelstatus`
--

INSERT INTO `bestelstatus` (`id`, `omschrijving`) VALUES
(1, 'geregistreerd'),
(2, 'in behandeling'),
(3, 'bereid'),
(4, 'afgeleverd'),
(5, 'afgerond');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `broodjes`
--

CREATE TABLE `broodjes` (
  `id` int(11) NOT NULL,
  `Naam` varchar(50) NOT NULL,
  `Omschrijving` varchar(500) NOT NULL,
  `Prijs` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'default.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `broodjes`
--

INSERT INTO `broodjes` (`id`, `Naam`, `Omschrijving`, `Prijs`, `image`) VALUES
(1, 'Kaas', 'jonge kaas, sla, ei, komkommer, tomaat, mayonaise', '1.90', 'broodje-kaas.jpg'),
(2, 'Ham', 'natuurham, sla, ei, tuinkers, komkommer, cocktailsaus', '1.90', 'broodje-ham.jpg'),
(3, 'Kaas en ham', 'jonge kaas, natuurham, sla, ei, wortelen, tomaat, mayonaise', '2.10', 'broodje-kaas-ham.jpg'),
(4, 'Fitness kip', 'kip natuur, perzik, sla, olijven, tomaat, komkommer, yoghurtdressing', '3.50', 'broodje-fitness-kip.jpg'),
(5, 'Sombrero', 'kip natuur, rode paprika, maïs, sla, komkommer, tomaat, ei, ui, salsa taquera ', '3.70', 'broodje-sombrero.jpg'),
(6, 'Americain en tartaar', 'americain, ui, komkommer, ei, tuinkers, tartaarsaus ', '3.50', 'broodje-americain-tartaar.jpg'),
(7, 'Indian kip', 'kip natuur, ananas, tuinkers, avocado, curry dressing', '4.00', 'broodje-indian-kip.jpg'),
(8, 'Grieks', 'feta, tuinkers, komkommer, tomaat, olijventapenade', '3.90', 'broodje-grieks.jpg'),
(9, 'Tonijntino', 'tonijn pikant, ui, augurk, martinosaus (met tabasco)', '2.60', 'broodje-tonijntino.jpg'),
(10, 'Wrap exotisch', 'kip natuur, sla, tomaat, komkommer, ei, ananas, cocktailsaus', '3.70', 'wrap-exotisch.jpg'),
(11, 'Wrap kip en spek', 'kip natuur, spek, sla, tomaat, komkommer, BBQ saus', '4.00', 'wrap-kip-spek.jpg'),
(19, 'Camembert', 'salami, camembert, sla, augurk, cranberrysaus', '3.70', 'broodje-camembert.jpg');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `voornaam` varchar(45) NOT NULL,
  `familienaam` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `wachtwoord` varchar(255) NOT NULL,
  `datum` datetime NOT NULL,
  `geblokkeerd` tinyint(1) DEFAULT NULL,
  `role` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `users`
--

INSERT INTO `users` (`id`, `voornaam`, `familienaam`, `email`, `wachtwoord`, `datum`, `geblokkeerd`, `role`) VALUES
(14, 'Gwen', 'Van Laere', 'gwen_van_laere@hotmail.com', '$2y$10$2OdfmHAj5ZFWLK8QZcvu6.Jh1250.jdnnzrP7gEY7TRYl8/HErcea', '2021-08-13 14:38:46', 0, 0),
(15, 'Ellen', 'Van Laere', 'ellen_van_laere@hotmail.com', '$2y$10$PFhcbQ61FS9MgZpbXCWymOt7/q5faqeroo6uHehIaWVHqihoLtLOK', '2021-08-13 14:39:18', 0, 0),
(16, 'super', 'user', 'superuser@broodjesbar.be', '$2y$10$9W4FO10hDydt9t2p5W2QZ.jSemmwKueQhJIdZ/1ST1IZXjUyBqzIq', '2021-08-13 14:39:57', 0, 1),
(17, 'marlain', 'Van Laere', 'marlain_van_laere@hotmail.com', '$2y$10$uicPqXMJxRgSvoT7Ix6DoeBPmUhZn21XxhqEtwBY3yphSTQYKR8bu', '2021-08-15 19:52:58', 0, 0),
(18, 'Chantal', 'Froyman', 'chantal_froyman@hotmail.com', '$2y$10$EeXgrmlehSPSHEKWGSd91uBAP7N/33cBFq5RQOYsrxrQjznR/KNa2', '2021-08-17 14:39:41', 0, 0);

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `bestellingen`
--
ALTER TABLE `bestellingen`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `bestelstatus`
--
ALTER TABLE `bestelstatus`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `broodjes`
--
ALTER TABLE `broodjes`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `bestellingen`
--
ALTER TABLE `bestellingen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT voor een tabel `bestelstatus`
--
ALTER TABLE `bestelstatus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT voor een tabel `broodjes`
--
ALTER TABLE `broodjes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT voor een tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
