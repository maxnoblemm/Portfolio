import { Project, ArtWork, Photography } from './types';

// 1. VITE GLOB: Look in the actual file system path
const imageModules = import.meta.glob('./public/Photography/*.{png,jpg,jpeg,SVG}', { 
  eager: true, 
  query: 'url' 
});

const formatFileName = (path: string) => {
  return path
    .split('/')
    .pop()
    ?.split('.')[0]
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Untitled';
};

export const PROJECTS: Project[] = [
  {
    id: 'pub-1',
    title: 'Amyloid-β-driven Alzheimer\'s disease reshapes the colonic immune system in mice',
    description: 'Developed bioinformatics pipelines to process 16S microbiome sequencing data.',
    tags: ['Aging', 'Microbiome', 'R'],
    image: 'Covers/CellReportsAD.png', 
    link: 'https://doi.org/10.1016/j.celrep.2025.116109',
    type: 'Publication'
  },
  // {
  //   id: 'pub-2',
  //   title: 'Spaceflight as a Model of Accelerated Aging',
  //   description: 'Review positioning spaceflight as a model for environment-driven aging',
  //   tags: ['Spaceflight', 'Aging', 'Systems Biology'],
  //   image: 'Covers/Manwaring_Mueller_Et_Al.jpg', 
  //   type: 'Publication'
  // },
  {
    id: 'pub-3',
    title: 'Longitudinal Modeling of the Microbiome in Celiac Disease',
    description: 'Modeling gut microbiome development using CDGEMM Consortium data.',
    tags: ['Celiac Disease', 'Longitudinal Multi-omics', 'Autoimmunity'],
    image: 'Covers/CDGEMM COVER.jpg', 
    link: 'https://doi.org/10.1016/S0016-5085(25)01156-4',
    type: 'Project'
  },
  {
    id: 'pub-4',
    title: 'Immunological biomarkers of aging',
    description: 'Review evaluates evolution of immunological biomarkers and organoids.',
    tags: ['Organoids', 'Aging', 'Immunology'],
    image: 'Covers/ImmunologicalBiomarkers.png', 
    link: 'https://doi.org/10.1093/jimmun/vkae036',
    type: 'Publication'
  },
  {
    id: 'pub-5',
    title: 'Substrate Stiffness Dictates Unique Doxorubicin-induced Senescence-associated Secretory Phenotypes and Transcriptomic Signatures in Human Pulmonary Fibroblasts',
    description: 'Primary research finding substrate stiffness modulates senescent-cell secretory profile.',
    tags: ['Cell Culture', 'Aging', 'Senescence'],
    image: 'Covers/Substrate_Stiffness.jpg', 
    link: 'https://doi.org/10.1007/s11357-025-01507-x',
    type: 'Publication'
  }
];

export const ART_WORKS: ArtWork[] = [
  {
    id: 'art-1',
    title: 'Nature Aging: A DNA-Methylation Clock for Intrinsic Capacity',
    client: 'Furman Lab',
    image: 'Covers/NatAging_Cover.png'
  },
  {
    id: 'art-2',
    title: 'Cell Reports: Amyloid-β-driven Alzheimer\'s disease reshapes the colonic immune system in mice',
    client: 'Winer Lab',
    image: 'Covers/Final_Cover_Submission-02.png'
  },
  {
    id: 'art-3',
    title: 'Aging Cell: Multi-Omics Analysis Reveals Biomarkers That Contribute to Biological Age Rejuvenation in Response to Single-Blinded Randomized Placebo-Controlled Therapeutic Plasma Exchange',
    client: 'Furman Lab',
    image: 'Covers/TPE_Cover.png'
  }
];

// 2. AUTOMATED PHOTOGRAPHY EXPORT
export const PHOTOGRAPHY: Photography[] = Object.entries(imageModules).map(([path, url], index) => {
  const browserUrl = (url as any).default || url;
  const cleanUrl = typeof browserUrl === 'string' 
  ? browserUrl.replace('./public', import.meta.env.BASE_URL).replace('//', '/')
  : browserUrl;

  return {
    id: `photo-${index}`,
    title: formatFileName(path),
    location: 'Gallery',
    image: cleanUrl
  };
});

// constants.tsx
export const BIO = {
  name: "Max Manwaring Mueller",
  title: "MSTP Student",
  image: 'IMG_6704.jpeg', 
  visionText: `My work in science and medicine lies at the intersection of epidemiology and molecular biology. Originally trained as a "wet lab" biologist studying triple-negative breast cancer, I developed a foundational respect for the basic biomedical sciences and the cellular pathways that govern health. However, as my interests evolved, I began to seek out systems that could more closely mirror the complexities of human biology.

This search led me to the intersection of organoid modeling and bioinformatics. By combining the ability to recreate specific tissue niches with the power to analyze real-world human data, I have found a compelling space where molecular discovery and clinical impact are more closely aligned. In my recent work at the Buck Institute, I have seen firsthand how rapidly these computational and biological tools are advancing. I believe we are on the verge of a new era of science—one dedicated to truly understanding, treating, and leveraging the complicated dynamics of immune, neural, and microbial systems.

This mission is as personal as it is professional. As someone living with an autoimmune disease, I am intimately familiar with the "diagnostic odyssey"—the period of chronic pain and persistent unknowns that so many face before finding answers. It is with both the rigor of a scientist and the hope of a patient that I advocate for a shift in the medical paradigm: away from reactive care and toward the proactive management of individual risk. By understanding the root causes of systemic failure and allotting more resources to prevention, we can address the development of complex diseases before they take hold.

I view bioinformatics as the most effective toolset we have to decode these complexities, but I also believe that science must be seen and felt to be truly effective. I have found that the intersection of graphic design and data science is an essential bridge for communication. It allows me to translate lingo-laden scientific stories into accessible, visual narratives—ensuring that the progress of modern medicine is not just documented, but understood.

It is a truly exciting time to be exploring the fundamental connections between our internal biology and the world we inhabit. Thanks for reading.`, 

  purposeText: `I have built this website because I believe that the progress of science and medicine depends on open communication and the shared use of resources. No discovery happens in a vacuum, and I want to collaborate with others to see these fields succeed. This space is a place for me to share my own thoughts as well as the work of others that I find particularly important, useful, or interesting.

  You can explore my Publications for a look at my research, or visit the Artwork and Photography tabs to see how I use visual media as a storytelling device for science and the human system. I welcome collaborations and discussions at any time, and I look forward to connecting with anyone who shares a commitment to advancing the next wave of biomedical science.`
};
