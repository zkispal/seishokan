CREATE TABLE `person` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `lastname` varchar(100) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `firstname` varchar(25) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `dateofbirth` date DEFAULT NULL,
  `rankID` int(10) unsigned DEFAULT NULL,
  `homedojoID` int(10) unsigned DEFAULT NULL,
  `parentID` int(10) unsigned DEFAULT NULL,
  `practicestart` date DEFAULT NULL,
  `username` varchar(45) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `passhash` varchar(60) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `email` varchar(45) COLLATE utf8_hungarian_ci DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`),
  KEY `rankofperson_idx` (`rankID`),
  KEY `homedojoofperson_idx` (`homedojoID`),
  KEY `parentofperson_idx` (`parentID`),
  CONSTRAINT `homedojoofperson` FOREIGN KEY (`homedojoID`) REFERENCES `location` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `parentofperson` FOREIGN KEY (`parentID`) REFERENCES `person` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `rankofperson` FOREIGN KEY (`rankID`) REFERENCES `rank` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE `location` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `city` varchar(45) COLLATE utf8_hungarian_ci NOT NULL,
  `zipcode` char(4) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `address` varchar(45) COLLATE utf8_hungarian_ci NOT NULL,
  `building` varchar(80) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `lat` decimal(9,6) DEFAULT NULL,
  `lon` decimal(9,6) DEFAULT NULL,
  `locationtype` enum('Dojo','Eseményhelyszín') COLLATE utf8_hungarian_ci DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE `event` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `locationID` int(10) unsigned NOT NULL,
  `eventtypeID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`),
  KEY `locationofevent_idx` (`locationID`),
  KEY `typeofevent_idx` (`eventtypeID`),
  CONSTRAINT `locationofevent` FOREIGN KEY (`locationID`) REFERENCES `location` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `typeofevent` FOREIGN KEY (`eventtypeID`) REFERENCES `eventtype` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=584 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE `eventtype` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `eventtypename` varchar(45) NOT NULL,
  `eventtypestring` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

CREATE TABLE `attendances` (
  `eventID` int(10) unsigned NOT NULL,
  `attendeeID` int(10) unsigned NOT NULL,
  `attendancetype` enum('Registered','Attended','Sikeres','Sikertelen') COLLATE utf8_hungarian_ci DEFAULT NULL,
  `instructorID` int(10) unsigned DEFAULT NULL,
  `certno` varchar(20) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `rankattempted` int(10) unsigned DEFAULT NULL,
  UNIQUE KEY `eventattendeeuniq` (`eventID`,`attendeeID`),
  KEY `eventofattendance_idx` (`eventID`),
  KEY `attendeeofattendance_idx` (`attendeeID`),
  KEY `instructorofattendance_idx` (`instructorID`),
  KEY `attemptedrankofattendace_idx` (`rankattempted`),
  CONSTRAINT `attemptedrankofattendace` FOREIGN KEY (`rankattempted`) REFERENCES `rank` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `attendeeofattendance` FOREIGN KEY (`attendeeID`) REFERENCES `person` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `eventofattendance` FOREIGN KEY (`eventID`) REFERENCES `event` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `instructorofattendance` FOREIGN KEY (`instructorID`) REFERENCES `person` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE `rank` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_hungarian_ci NOT NULL,
  `reqtrainings` int(11) NOT NULL,
  `reqwaza` varchar(2000) COLLATE utf8_hungarian_ci NOT NULL,
  `ranklevel` tinyint(4) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE `role` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rolename` enum('Dojocho','Aikidoka','Instructor','Assistant','Parent','Admin','Cashhandler','Visitor') COLLATE utf8_hungarian_ci NOT NULL,
  `rolestring` enum('Dojocho','Aikido gyakorló','Oktató','Asszisztens','Gyakorló szülője','Admin','Készpénzkezelő','Látogató') COLLATE utf8_hungarian_ci NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE `roles` (
  `personID` int(10) unsigned NOT NULL,
  `roleID` int(10) unsigned NOT NULL,
  KEY `personinroles_idx` (`personID`),
  KEY `roleinroles_idx` (`roleID`),
  CONSTRAINT `personinroles` FOREIGN KEY (`personID`) REFERENCES `person` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `roleinroles` FOREIGN KEY (`roleID`) REFERENCES `role` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;


CREATE TABLE `calendar` (
  `day` int(10) unsigned NOT NULL,
  `weekday` varchar(10) DEFAULT NULL,
  `locationtypes` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`day`),
  UNIQUE KEY `locationtypes` (`locationtypes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DELIMITER $$
CREATE DEFINER=`root`@`localhost` 
        PROCEDURE `addPractice`(	IN _start DATETIME,
                                    IN _end DATETIME,
                                    IN _weekday INT(10),
                                    IN _length INT(10),
                                    IN _locationID INT(10),
                                    IN _eventtypeID INT(10))
BEGIN
 DECLARE practiceName VARCHAR(50);
 SELECT eventtype.eventtypestring INTO practiceName FROM eventtype WHERE eventtype.ID = _eventtypeID;
 INSERT INTO event (name, start, end, locationID, eventtypeID)
 SELECT practiceName AS name,
 DATE_ADD(_start,INTERVAL calendar.day DAY) AS start,
 DATE_ADD(DATE_ADD(_start,INTERVAL calendar.day DAY), INTERVAL _length MINUTE ) AS end,
 _locationID AS locationID, _eventtypeID AS eventtypeID FROM calendar
 WHERE DAYOFWEEK(DATE_ADD(_start,INTERVAL calendar.day DAY)) = _weekday AND
	DATE(DATE_ADD(_start,INTERVAL calendar.day DAY)) BETWEEN DATE(_start) AND DATE(_end) AND
	DATE(DATE_ADD(_start,INTERVAL calendar.day DAY)) NOT IN 
        (SELECT DATE(start)
		FROM event 
		WHERE YEAR(start) = YEAR(DATE_ADD(_start,INTERVAL calendar.day DAY)) AND
				DAYOFYEAR(start) = DAYOFYEAR(DATE_ADD(_start,INTERVAL calendar.day DAY)) AND 
			    event.locationID = _locationID AND 
				event.eventtypeID = _eventtypeID);
 END$$
DELIMITER ;
