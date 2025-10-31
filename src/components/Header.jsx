﻿import "../styles.css";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  useDisclosure, VStack, Text, Heading, Button, Input, FormControl, FormLabel, HStack, IconButton
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import logoDefault from "../assets/RétroBouh2025.svg";
import Navbar from "./Navbar.jsx";
import CompatImg from "./CompatImg.jsx";

// Icônes (remplies en rouge rétrobus)
const SimpleHeartIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--rbe-red)" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.59 4.81 14.26 4 16 4 18.5 4 20.5 6 20.5 8.5c0 3.78-3.4 6.86-8.05 11.54L12 21.35z"/>
  </svg>
);

const EnvelopeIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--rbe-red)" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v.4L12 12 3 6.4V6Zm0 2.8V18c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.8l-9.3 5.7a1 1 0 0 1-1.05 0L3 8.8Z"/>
  </svg>
);

const LOGO_PATH = "/assets/rbe_logo.svg";
const HEADER_BG = "/assets/fallback/_MG_1006.jpg";

export default function Header() {
  const { isOpen: isDonateOpen, onOpen: onDonateOpen, onClose: onDonateClose } = useDisclosure();
  const { isOpen: isNewsletterOpen, onOpen: onNewsletterOpen, onClose: onNewsletterClose } = useDisclosure();
  const navDisclosure = useDisclosure();
  
  const [donateAmount, setDonateAmount] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  
  const location = useLocation();

  // Configuration publique (HelloAsso + version)
  const [helloAssoUrl, setHelloAssoUrl] = useState('https://www.helloasso.com/associations/association-retrobus-essonne/formulaires/3');
  const [siteVersion, setSiteVersion] = useState('');
  // Header config (focal point et taille configurables via API, images gérées manuellement)
  const [headerBgSize, setHeaderBgSize] = useState('cover');
  const [headerBgFocal, setHeaderBgFocal] = useState({ x: 50, y: 50 });
  const [logoHeight, setLogoHeight] = useState(44);

    useEffect(() => {
      const API_BASE = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';
      const candidates = [
        `${(API_BASE || '').replace(/\/$/, '')}/site-config`,
        '/site-config.json', // fallback éventuel statique côté public
      ];
      (async () => {
        for (const url of candidates) {
          try {
            const res = await fetch(url, { headers: { Accept: 'application/json' } });
            if (!res.ok) continue;
            const data = await res.json();
            if (data?.helloAssoUrl) {
              setHelloAssoUrl(String(data.helloAssoUrl));
            }
            if (data?.siteVersion) {
              setSiteVersion(String(data.siteVersion));
            }
            // Header fields
            if (data?.headerBgSize) setHeaderBgSize(String(data.headerBgSize));
            if (Number.isFinite(data?.headerBgFocalX) && Number.isFinite(data?.headerBgFocalY)) {
              setHeaderBgFocal({ x: data.headerBgFocalX, y: data.headerBgFocalY });
            }
            if (Number.isFinite(data?.logoWidth)) setLogoHeight(parseInt(data.logoWidth, 10));
            break;
          } catch {}
        }
      })();
    }, []);

    // Fonction pour ouvrir HelloAsso
    const handleDonateClick = () => {
      window.open(helloAssoUrl || 'https://www.helloasso.com/associations/retrobus-essonne', '_blank');
    };

  return (
    <>
      <header className="site-header">
        {/* Background - toujours depuis le fichier public /assets/header.jpg */}
        <div
          className="header-bg"
          style={{
            backgroundImage: `url(/assets/header.jpg?t=${Date.now()})`,
            backgroundSize: headerBgSize || 'cover',
            backgroundPosition: `${headerBgFocal.x}% ${headerBgFocal.y}%`
          }}
        />
        
        {/* Content */}
        <div className="header-inner">
          <CompatImg 
            className="header-logo" 
            path={LOGO_PATH}
            alt="Logo RBE"
            fallback={logoDefault}
            style={{ height: `${logoHeight || 44}px` }}
          />
          {/* Mobile menu trigger on the right inside header */}
          <Box display={{ base: "block", md: "none" }}>
            <IconButton
              icon={<HamburgerIcon />}
              onClick={navDisclosure.onOpen}
              variant="solid"
              bg="whiteAlpha.900"
              color="var(--rbe-red)"
              size="md"
              borderRadius="full"
              boxShadow="sm"
              _hover={{ bg: "var(--rbe-red)", color: "white" }}
              aria-label="Menu"
            />
          </Box>
        </div>
      </header>

      <Navbar
        donateIcon={<SimpleHeartIcon />}
        newsletterIcon={<EnvelopeIcon />}
        onDonateClick={handleDonateClick}
        onNewsletterClick={onNewsletterOpen}
        siteVersion={siteVersion}
        // Pass disclosure to embed Drawer without its own trigger
        isOpen={navDisclosure.isOpen}
        onOpen={navDisclosure.onOpen}
        onClose={navDisclosure.onClose}
        embedded
        // Optional: pass a first name if available
        userName={(typeof window !== 'undefined' && (localStorage.getItem('prenom') || localStorage.getItem('firstName') || localStorage.getItem('firstname') || localStorage.getItem('name'))) || undefined}
      />

      {/* Modal Newsletter */}
      <Modal isOpen={isNewsletterOpen} onClose={onNewsletterClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={2}>
              <EnvelopeIcon size={24} />
              <Text>Newsletter RBE</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={4} color="gray.600">
              Restez informé de nos actualités, événements et nouveautés !
            </Text>
            
            <FormControl mb={4}>
              <FormLabel>Adresse email</FormLabel>
              <Input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="votre@email.com"
              />
            </FormControl>
            
            <Button
              colorScheme="red"
              width="100%"
              onClick={() => {
                // Logique d'inscription newsletter
                console.log('Newsletter:', newsletterEmail);
                onNewsletterClose();
              }}
            >
              S'inscrire à la newsletter
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}