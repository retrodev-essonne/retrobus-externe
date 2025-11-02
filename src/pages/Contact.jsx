import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button,
  Alert,
  AlertIcon,
  useToast
} from "@chakra-ui/react";

export default function Contact() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Configuration API pour envoyer les emails via le backend
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);
    
    try {
      // Validation basique
      if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
        setShowError(true);
        toast({
          status: "error",
          title: "Champs requis",
          description: "Veuillez remplir tous les champs",
          duration: 5000,
          isClosable: true
        });
        setIsSubmitting(false);
        return;
      }

      console.log('📧 Envoi du message de contact...', {
        from: formData.email,
        subject: formData.subject
      });

      // Essayer plusieurs endpoints possibles
      const endpoints = [
        `${API_BASE_URL}/contact/send`,
        `${API_BASE_URL}/api/contact/send`,
        `${API_BASE_URL}/email/send-contact`,
        `${API_BASE_URL}/api/email/send-contact`
      ];

      let success = false;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              senderName: formData.name,
              senderEmail: formData.email,
              subject: formData.subject,
              message: formData.message,
              recipientEmail: 'association.rbe@gmail.com'
            })
          });

          if (response.ok) {
            const result = await response.json();
            console.log('✅ Email envoyé avec succès:', result);
            success = true;
            break;
          }
        } catch (err) {
          lastError = err;
          console.warn(`⚠️ Endpoint ${endpoint} échoué:`, err.message);
          continue;
        }
      }

      if (success) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        toast({
          status: "success",
          title: "Message envoyé",
          description: "Votre message a été envoyé avec succès. Nous vous répondrons rapidement.",
          duration: 5000,
          isClosable: true
        });
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        // Si le backend ne répond pas, envoyer via fallback local
        console.log('⚠️ Backend non disponible, utilisation du fallback...');
        await sendViaFallback();
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi:', error);
      setShowError(true);
      toast({
        status: "error",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer ou nous contacter directement.",
        duration: 5000,
        isClosable: true
      });
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback: envoyer via un service d'email tiers si le backend ne répond pas
  const sendViaFallback = async () => {
    try {
      // Créer un lien mailto comme fallback
      const mailtoLink = `mailto:association.rbe@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`De: ${formData.name} <${formData.email}>\n\n${formData.message}`)}`;
      
      // Copier l'adresse email dans le presse-papiers
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(formData.email);
      }
      
      toast({
        status: "info",
        title: "Serveur temporairement indisponible",
        description: "Votre adresse email a été copiée. Veuillez nous envoyer votre message directement à association.rbe@gmail.com",
        duration: 7000,
        isClosable: true
      });

      // Ouvrir le client email par défaut
      window.open(mailtoLink);
      
      setShowSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('❌ Fallback échoué:', error);
      setShowError(true);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "2px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "4px",
    color: "#2d3748"
  };

  return (
    <>
      <Helmet>
        <title>Contact - Association RétroBus Essonne</title>
        <meta name="description" content="Contactez l'association RétroBus Essonne pour toute question ou partenariat." />
      </Helmet>

      {/* Container PLEINE LARGEUR - IMAGE PLUS MONTÉE */}
      <Box
        position="relative"
        width="100vw"
        height="calc(100vh - var(--header-h) - var(--nav-h) + 100px)"
        marginTop="-100px"
        marginLeft="calc(-50vw + 50%)"
        backgroundImage="url('/assets/photos/p4.jpg')"
        backgroundSize="cover"
        backgroundPosition="center 60%"
        backgroundRepeat="no-repeat"
        overflow="hidden"
      >
        {/* Overlay pour améliorer la lisibilité */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          backgroundColor="rgba(0, 0, 0, 0.4)"
          zIndex={1}
        />

        {/* Contenu CENTRÉ */}
        <Box 
          position="relative" 
          zIndex={2}
          width="100%"
          height="100%"
          paddingTop="calc(100px + 1rem)"
          paddingBottom={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          
          {/* Widget formulaire RÉDUIT EN HAUTEUR */}
          <Box
            w={{ base: "90%", md: "480px", lg: "520px" }}
            maxW="520px"
            bg="white"
            borderRadius="lg"
            boxShadow="2xl"
            p={6}
            maxHeight="calc(100vh - var(--header-h) - var(--nav-h) - 4rem)"
            overflowY="auto"
          >
            <VStack spacing={4} align="stretch">
              <Box textAlign="center">
                <Heading as="h1" size="lg" color="var(--rbe-red)" mb={2}>
                  Nous contacter
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Une question ? Un projet ? Écrivez-nous !
                </Text>
              </Box>

              {showSuccess && (
                <Alert status="success" mb={4}>
                  <AlertIcon />
                  Message envoyé avec succès !
                </Alert>
              )}
              
              {showError && (
                <Alert status="error" mb={4}>
                  <AlertIcon />
                  Erreur lors de l'envoi. Veuillez réessayer ou nous contacter directement.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <VStack spacing={3} align="stretch">
                  <Box>
                    <label style={labelStyle}>
                      Nom <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--rbe-red)"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </Box>

                  <Box>
                    <label style={labelStyle}>
                      Email <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--rbe-red)"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </Box>

                  <Box>
                    <label style={labelStyle}>
                      Sujet <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Objet de votre message"
                      required
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--rbe-red)"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </Box>

                  <Box>
                    <label style={labelStyle}>
                      Message <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Votre message..."
                      rows={3}
                      required
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        minHeight: "80px"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "var(--rbe-red)"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </Box>

                  <Button
                    type="submit"
                    w="100%"
                    bg="var(--rbe-red)"
                    color="white"
                    size="md"
                    borderRadius="md"
                    isDisabled={isSubmitting}
                    _hover={{ bg: "red.600" }}
                    _disabled={{ bg: "gray.400", cursor: "not-allowed" }}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </Button>
                </VStack>
              </form>

              <Box pt={3} borderTop="1px solid" borderColor="gray.200">
                <Text fontSize="xs" color="gray.500" textAlign="center" mb={2}>
                  Ou contactez-nous directement :
                </Text>
                <VStack spacing={1}>
                  <Text fontSize="sm" fontWeight="600" color="var(--rbe-red)">
                    📧 association.rbe@gmail.com
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    📍 Essonne, France
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </Box>

        </Box>
      </Box>
    </>
  );
}