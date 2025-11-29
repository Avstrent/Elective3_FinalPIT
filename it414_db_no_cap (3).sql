-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2025 at 08:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `it414_db_no_cap`
--

-- --------------------------------------------------------

--
-- Table structure for table `rfid_logs`
--

CREATE TABLE `rfid_logs` (
  `id` int(11) NOT NULL,
  `time_log` varchar(30) DEFAULT NULL,
  `rfid_data` varchar(20) DEFAULT NULL,
  `rfid_status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rfid_logs`
--

INSERT INTO `rfid_logs` (`id`, `time_log`, `rfid_data`, `rfid_status`) VALUES
(1, '2025-11-22 05:50:07 PM', 'F265F21B', NULL),
(2, '2025-11-22 05:50:28 PM', '461FEC1C', NULL),
(3, '2025-11-22 05:50:31 PM', 'C3D68833', 1),
(4, '2025-11-22 05:51:35 PM', 'C3D68833', 0),
(5, '2025-11-22 05:51:46 PM', '461FEC1C', NULL),
(6, '2025-11-22 05:51:48 PM', 'C3D68833', 1),
(7, '2025-11-22 05:51:54 PM', '461FEC1C', NULL),
(8, '2025-11-22 05:51:57 PM', 'C3D68833', 0),
(9, '2025-11-22 05:52:10 PM', 'F265F21B', NULL),
(10, '2025-11-22 05:52:26 PM', 'F265F21B', NULL),
(11, '2025-11-22 05:52:33 PM', 'F265F21B', NULL),
(12, '2025-11-22 05:52:37 PM', 'F265F21B', NULL),
(13, '2025-11-22 05:53:15 PM', 'F265F21B', NULL),
(14, '2025-11-22 05:53:42 PM', 'C3D68833', 1),
(15, '2025-11-22 05:53:48 PM', 'C3D68833', 0),
(16, '2025-11-22 05:54:38 PM', 'C3D68833', 1),
(17, '2025-11-22 05:54:52 PM', 'C3D68833', 0),
(18, '2025-11-22 05:55:02 PM', 'C3D68833', 1),
(19, '2025-11-22 05:55:23 PM', 'C3D68833', 0),
(20, '2025-11-22 05:57:54 PM', 'C3D68833', 1),
(21, '2025-11-22 05:58:01 PM', '461FEC1C', NULL),
(22, '2025-11-22 05:58:04 PM', 'C3D68833', 0),
(23, '2025-11-22 05:58:54 PM', 'B22C8CAB', 1),
(24, '2025-11-22 05:58:59 PM', 'C3D68833', 1),
(25, '2025-11-22 05:59:04 PM', '461FEC1C', NULL),
(26, '2025-11-22 05:59:08 PM', '461FEC1C', NULL),
(27, '2025-11-22 05:59:17 PM', '461FEC1C', NULL),
(28, '2025-11-22 05:59:20 PM', 'C3D68833', 0),
(29, '2025-11-22 05:59:23 PM', 'B22C8CAB', 0),
(30, '2025-11-22 06:00:35 PM', 'C3D68833', 1),
(31, '2025-11-22 06:00:38 PM', 'C3D68833', 0),
(32, '2025-11-22 06:00:52 PM', 'C3D68833', 1),
(33, '2025-11-22 06:00:55 PM', 'C3D68833', 0),
(34, '2025-11-28 11:17:24 PM', 'B22C8CAB', 1),
(35, '2025-11-28 11:19:28 PM', 'B22C8CAB', 0),
(36, '2025-11-28 11:19:34 PM', 'B22C8CAB', 1),
(37, '2025-11-28 11:19:47 PM', 'B22C8CAB', 0),
(38, '2025-11-28 11:20:04 PM', 'B22C8CAB', 1),
(39, '2025-11-28 11:20:07 PM', 'B22C8CAB', 0),
(40, '2025-11-28 11:20:15 PM', 'B22C8CAB', 1),
(41, '2025-11-28 11:20:21 PM', 'B22C8CAB', 0),
(42, '2025-11-28 11:22:21 PM', 'B22C8CAB', 1),
(43, '2025-11-28 11:22:25 PM', 'B22C8CAB', 0),
(44, '2025-11-28 11:23:30 PM', 'B22C8CAB', 1),
(45, '2025-11-28 11:23:33 PM', 'B22C8CAB', 0),
(46, '2025-11-28 11:23:40 PM', 'B22C8CAB', 1),
(47, '2025-11-28 11:23:45 PM', 'B22C8CAB', 0),
(48, '2025-11-28 11:31:01 PM', 'B22C8CAB', 1),
(49, '2025-11-28 11:31:03 PM', 'B22C8CAB', 0),
(50, '2025-11-28 11:31:06 PM', 'B22C8CAB', 1),
(51, '2025-11-28 11:31:11 PM', 'B22C8CAB', 0),
(52, '2025-11-28 11:31:15 PM', 'B22C8CAB', 1),
(53, '2025-11-28 11:32:08 PM', 'B22C8CAB', 0),
(54, '2025-11-28 11:32:10 PM', 'B22C8CAB', 1),
(55, '2025-11-28 11:32:14 PM', 'B22C8CAB', 0),
(56, '2025-11-28 11:32:20 PM', 'B22C8CAB', 1),
(57, '2025-11-28 11:32:24 PM', 'B22C8CAB', 0),
(58, '2025-11-28 11:33:59 PM', 'B22C8CAB', 1),
(59, '2025-11-28 11:34:05 PM', 'B22C8CAB', 0),
(60, '2025-11-28 11:41:54 PM', 'B22C8CAB', 1),
(61, '2025-11-28 11:41:57 PM', 'B22C8CAB', 0),
(62, '2025-11-28 11:42:02 PM', 'B22C8CAB', 1),
(63, '2025-11-28 11:42:04 PM', 'B22C8CAB', 0),
(64, '2025-11-28 11:42:08 PM', 'C3D68833', 1),
(65, '2025-11-28 11:42:28 PM', '461FEC1C', NULL),
(66, '2025-11-28 11:42:35 PM', 'C3D68833', 0),
(67, '2025-11-28 11:42:41 PM', '461FEC1C', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rfid_reg`
--

CREATE TABLE `rfid_reg` (
  `rfid_data` varchar(20) NOT NULL,
  `rfid_status` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rfid_reg`
--

INSERT INTO `rfid_reg` (`rfid_data`, `rfid_status`) VALUES
('B22C8CAB', 0),
('C3D68833', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rfid_logs`
--
ALTER TABLE `rfid_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rfid_reg`
--
ALTER TABLE `rfid_reg`
  ADD PRIMARY KEY (`rfid_data`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rfid_logs`
--
ALTER TABLE `rfid_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
