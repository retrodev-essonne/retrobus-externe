import React, { useState, useEffect } from "react";
import {
  Container, Heading, Text, VStack, HStack, Badge, Card, CardBody, 
  CardHeader, Spinner, Alert, AlertIcon, Box, Icon, Divider
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getTypeColor = (type) => {
  switch (type) {
    case 'feature': return 'green';
    case 'fix': return 'red';
    case 'update': return 'blue';
    case 'security': return 'purple';
    default: return 'gray';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'feature': return '✨';
    case 'fix': return '🐛';
    case 'update': return '🔄';
    case 'security': return '🔒';
    default: return '📝';
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function Changelog() {
  const [changelog, setChangelog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChangelog();
  }, []);

  const loadChangelog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try absolute API first if provided, else relative (rewritten by Vercel)
      const urls = [];
      if (API_BASE) urls.push(`${API_BASE.replace(/\/$/, '')}/changelog`);
      urls.push('/changelog');

      let data = null;
      let lastErr = null;
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            data = await res.json();
            break;
          } else {
            lastErr = new Error(`HTTP ${res.status}`);
          }
        } catch (e) {
          lastErr = e;
        }
      }

      if (!data) throw lastErr || new Error('Changelog indisponible');
      setChangelog(data.entries || []);
    } catch (err) {
      console.error('Erreur chargement changelog:', err);
      setError('Impossible de charger l\'historique des versions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Changelog - RétroBus Essonne</title>
        <meta name="description" content="Historique des versions et mises à jour de l'application RétroBus Essonne" />
      </Helmet>

      <Container maxW="container.md" py={10}>
        {/* En-tête */}
        <VStack spacing={6} textAlign="center" mb={10}>
          <Heading as="h1" size="xl" color="var(--rbe-red)">
            📝 Historique des versions
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Découvrez les dernières fonctionnalités, corrections et améliorations 
            apportées à l'application RétroBus Essonne.
          </Text>
        </VStack>

        {/* Contenu */}
        {loading ? (
          <VStack spacing={4} py={10}>
            <Spinner size="xl" color="var(--rbe-red)" />
            <Text color="gray.600">Chargement de l'historique...</Text>
          </VStack>
        ) : error ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">Erreur de chargement</Text>
              <Text fontSize="sm">{error}</Text>
            </VStack>
          </Alert>
        ) : changelog.length === 0 ? (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">Aucune version disponible</Text>
              <Text fontSize="sm">L'historique des versions sera bientôt disponible.</Text>
            </VStack>
          </Alert>
        ) : (
          <VStack spacing={6} align="stretch">
            {changelog.map((entry, index) => (
              <Card 
                key={entry.id} 
                variant="outline" 
                borderLeft="4px solid"
                borderLeftColor={`${getTypeColor(entry.type)}.500`}
                shadow="sm"
                _hover={{ shadow: "md" }}
                transition="all 0.2s"
              >
                <CardHeader>
                  <VStack align="start" spacing={3}>
                    <HStack justify="space-between" w="full">
                      <HStack>
                        <Badge 
                          colorScheme={getTypeColor(entry.type)} 
                          variant="solid" 
                          size="lg"
                          px={3}
                          py={1}
                        >
                          {getTypeIcon(entry.type)} {entry.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" size="lg" colorScheme="gray">
                          v{entry.version}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        {formatDate(entry.date)}
                      </Text>
                    </HStack>
                    
                    <Heading size="md" color="gray.800">
                      {entry.title}
                    </Heading>
                    
                    {entry.author && (
                      <Text fontSize="sm" color="gray.500">
                        Par {entry.author}
                      </Text>
                    )}
                  </VStack>
                </CardHeader>
                
                <CardBody pt={0}>
                  <Text color="gray.700" lineHeight="tall">
                    {entry.description}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}

        {/* Footer avec info */}
        {!loading && !error && changelog.length > 0 && (
          <Box mt={10} pt={6} borderTop="1px solid" borderColor="gray.200">
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                Dernière mise à jour de l'historique le {new Date().toLocaleDateString('fr-FR')}
              </Text>
              <Text fontSize="xs" color="gray.400" textAlign="center">
                Les versions sont automatiquement publiées depuis l'interface d'administration
              </Text>
            </VStack>
          </Box>
        )}
      </Container>
    </>
  );
}