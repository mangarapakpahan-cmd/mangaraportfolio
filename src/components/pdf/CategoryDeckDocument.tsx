import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ProjectWithMedia } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: '#0A0A0C',
    color: '#F1F5F9',
    fontFamily: 'Helvetica',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1.5,
    borderBottomColor: '#1E293B',
    paddingBottom: 14,
    marginBottom: 16,
  },
  headerLeft: {
    maxWidth: '68%',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 9.5,
    color: '#06B6D4',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  candidateBio: {
    fontSize: 8,
    color: '#94A3B8',
    lineHeight: 1.3,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: '#083344',
    borderWidth: 1,
    borderColor: '#0891B2',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 7.5,
    color: '#22D3EE',
    fontFamily: 'Helvetica-Bold',
  },
  metaText: {
    fontSize: 7,
    color: '#64748B',
    lineHeight: 1.2,
    textAlign: 'right',
  },

  categoryBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 6,
    padding: 9,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#06B6D4',
  },
  categoryTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#F8FAFC',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  categoryStats: {
    fontSize: 8,
    color: '#38BDF8',
    fontFamily: 'Helvetica-Bold',
  },

  projectCard: {
    backgroundColor: '#0F172A',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    marginBottom: 12,
  },
  projectRow: {
    flexDirection: 'row',
    gap: 14,
  },
  projectDetails: {
    flex: 1.15,
  },
  projectTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  projectRole: {
    fontSize: 8,
    color: '#38BDF8',
    marginBottom: 2,
  },
  projectDate: {
    fontSize: 7,
    color: '#64748B',
    marginBottom: 5,
  },
  projectSummary: {
    fontSize: 7.5,
    color: '#CBD5E1',
    lineHeight: 1.35,
    marginBottom: 6,
  },
  techStackContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3.5,
    marginTop: 3,
  },
  techPill: {
    backgroundColor: '#1E293B',
    borderRadius: 3,
    paddingHorizontal: 4.5,
    paddingVertical: 1.5,
  },
  techPillText: {
    fontSize: 6.5,
    color: '#94A3B8',
    fontFamily: 'Helvetica-Bold',
  },

  imageMatrix: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'flex-end',
  },
  imageWrapper: {
    width: '48%',
    height: 68,
    backgroundColor: '#020617',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  camTagBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    paddingHorizontal: 3.5,
    paddingVertical: 1,
    borderRadius: 2,
  },
  camTagText: {
    fontSize: 5.5,
    color: '#38BDF8',
    fontFamily: 'Helvetica-Bold',
  },

  footer: {
    position: 'absolute',
    bottom: 16,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 6.5,
    color: '#475569',
  },
});

interface CategoryDeckDocumentProps {
  projects: ProjectWithMedia[];
  activeCategoryName?: string;
  isFullPortfolio?: boolean;
}

export default function CategoryDeckDocument({
  projects,
  activeCategoryName = 'Master Portfolio Dossier',
  isFullPortfolio = false,
}: CategoryDeckDocumentProps) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Document title={`Mangara_Pakpahan_${activeCategoryName.replace(/\s+/g, '_')}_Dossier`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        
        {/* Header Cover / Identity Bar */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Mangara Ferdianto Pakpahan</Text>
            <Text style={styles.subtitle}>
              Creative Director &middot; Live Production Specialist &middot; Systems Engineer
            </Text>
            <Text style={styles.candidateBio}>
              Pusat Komando Operasional MCR: Live Broadcasting, Multi-Display LED Rigging, FOH Sound Engineering,
              Platform AI & IoT Hardware, serta Pemodelan Data Analitik Kuantitatif.
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {isFullPortfolio ? 'FULL TECHNICAL SPEC DECK' : 'CATEGORY DOSSIER BRIEF'}
              </Text>
            </View>
            <Text style={styles.metaText}>Dokumen ID: MCR-CMD-{new Date().getFullYear()}-01</Text>
            <Text style={styles.metaText}>Tanggal: {currentDate}</Text>
            <Text style={styles.metaText}>Kontak: mangarapakpahan51@gmail.com</Text>
          </View>
        </View>

        {/* Category Banner Title */}
        <View style={styles.categoryBanner}>
          <Text style={styles.categoryTitle}>{activeCategoryName}</Text>
          <Text style={styles.categoryStats}>
            {projects.length} Proyek Terdokumentasi &bull; Terverifikasi Siap Operasi
          </Text>
        </View>

        {/* Project Iteration Grid */}
        {projects.slice(0, 3).map((proj, idx) => (
          <View key={proj.id || idx} style={styles.projectCard} wrap={false}>
            <View style={styles.projectRow}>
              
              {/* Sisi Kiri: Detail Kegiatan */}
              <View style={styles.projectDetails}>
                <Text style={styles.projectTitle}>{proj.title}</Text>
                <Text style={styles.projectRole}>
                  Peran: {proj.role} &bull; {proj.event_date}
                </Text>
                <Text style={styles.projectSummary}>{proj.summary}</Text>
                
                <Text style={{ fontSize: 6.5, color: '#64748B', marginBottom: 2 }}>
                  Spesifikasi Perangkat &amp; Tech Stack:
                </Text>
                <View style={styles.techStackContainer}>
                  {proj.tech_stack.map((tech, tIdx) => (
                    <View key={tIdx} style={styles.techPill}>
                      <Text style={styles.techPillText}>{tech}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Sisi Kanan: Matriks 2x2 Foto Dokumentasi (Slot 1-4) */}
              <View style={styles.imageMatrix}>
                {proj.project_media && proj.project_media.slice(0, 4).map((m, mIdx) => (
                  <View key={mIdx} style={styles.imageWrapper}>
                    <Image src={m.image_url} style={styles.image} />
                    <View style={styles.camTagBadge}>
                      <Text style={styles.camTagText}>{m.camera_tag || `CAM 0${mIdx + 1}`}</Text>
                    </View>
                  </View>
                ))}
              </View>

            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated by MCR Command OS &middot; Portfolio &amp; Dossier Exporter &middot; Jakarta, ID
          </Text>
          <Text style={styles.footerText}>
            Halaman 1 dari 1 &middot; Confidential Technical Document
          </Text>
        </View>

      </Page>
    </Document>
  );
}
