import { Container, ContainerProps } from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { ReactNode } from 'react';

const variants: Variants = {
  hidden: {
    opacity: 0,
    x: 0,
    y: -40,
    transition: { duration: 0.4, type: 'easeOut' },
  },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.4, type: 'easeOut' },
  },
  exit: {
    opacity: 0,
    x: -0,
    y: 40,
    transition: { duration: 0.4, type: 'easeOut' },
  },
};

type PageProps = {
  title: string;
  description?: string;
  logo?: string;
  fav?: string;
  children: ReactNode;
};

const MotionContainer = motion<ContainerProps>(Container);

const PageLayout = ({ title, description, logo , fav, children }: PageProps) => {
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        twitter={{
          cardType: 'summary_large_image',
          handle: '@atmowork',
        }}
        openGraph={{
          url: 'http://localhost:3000',
          title: title,
          description: description,
          locale: 'en_US',
          images: [
            {
              url:  logo ?? './logo_transparent.png',
              width: 1200,
              height: 630,
              alt: 'Atmowork',
              type: 'image/png',
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href:  fav ?? './favicon.png',
          },
        ]}
      />
      <MotionContainer
        display='flex'
        minH={{ base: 'auto', md: '100vh' }}
        initial='hidden'
        animate='enter'
        exit='exit'
        centerContent
      >
        {children}
      </MotionContainer>
    </>
  );
};

export default PageLayout;
