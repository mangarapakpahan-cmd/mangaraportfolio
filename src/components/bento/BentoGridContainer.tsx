'use client';

import React from 'react';
import { WorkstationCategory, ProjectWithMedia } from '@/lib/types';
import RoleHeroCard from './RoleHeroCard';
import HardwareStackCard from './HardwareStackCard';
import ProjectCardItem from './ProjectCardItem';

interface BentoGridContainerProps {
  category: WorkstationCategory;
  projects: ProjectWithMedia[];
  onSelectProject: (project: ProjectWithMedia) => void;
}

export default function BentoGridContainer({
  category,
  projects,
  onSelectProject,
}: BentoGridContainerProps) {
  return (
    <section className="w-full mb-12 select-none">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Modul 1: Hero Role Card (Large - 5 Kolom) */}
        <div className="md:col-span-5">
          <RoleHeroCard category={category} projects={projects} />
        </div>

        {/* Modul 2: Hardware & Tech Stack Specs Card (3 Kolom) */}
        <div className="md:col-span-3">
          <HardwareStackCard category={category} />
        </div>

        {/* Modul 3: Project Showcase Grid Cards (4 Kolom) */}
        <div className="md:col-span-4 flex flex-col space-y-3.5">
          {projects.length === 0 ? (
            <div className="h-full min-h-[160px] rounded-3xl border border-dashed border-white/10 flex items-center justify-center font-mono text-xs text-slate-600 bg-white/[0.01]">
              NO WORKSTATION PROJECTS LOGGED
            </div>
          ) : (
            projects.slice(0, 2).map((proj) => (
              <ProjectCardItem
                key={proj.id}
                project={proj}
                onSelect={onSelectProject}
              />
            ))
          )}
        </div>

      </div>
    </section>
  );
}
