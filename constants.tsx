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
  visionText: `I have found interest in a field of science and medicine that lies at the intersection of epidemiology and molecular biology. As "omics"—genomics, proteomics, and metabolomics— are becoming increasingly affordable, analyzing many layers of a biological system across populations has become a feasible method of capturing the complexity of chronic disease. As computational tools improve and databases grow, I believe we will begin to untangle the deeply complicated dynamics of immune, neural, and microbial systems and their involvement in health and disease. This is truly an exciting time to explore the fundamental connections between our internal biology and the world we inhabit.

  This integration of data enables a new era of personalized health. My goal is to leverage these tools within the field of autoimmunity to understand the interplay between environmental triggers and genetic susceptibility. I believe that mapping these interactions is the key to achieving earlier diagnoses and more effective, tailored interventions. However, my commitment to this research is also a commitment to the environment. As someone who finds peace and purpose in the outdoors, I view the protection of our natural world and the study of human health as two sides of the same coin. 

  My perspective is deeply informed by my own navigation of the healthcare system. While modern medicine achieves remarkable feats, many patients - myself included - have gone and will continue to go through what can only be described as a diagnostic odyssey, defined by chronic pain and persistent unknowns, before returning to health. This experience underscores a critical opportunity for growth. We must evolve beyond the reactive management of symptoms toward a proactive understanding of the root causes underlying systemic failure.

  I view bioinformatics as the most effective toolset we have to decode these complexities, but I also believe that science needs to be seen and felt to be effective. I’ve found that the intersection of graphic design and data science is not only really, really fun, but extremely useful in communicating the hard to digest, lingo-laden scientific and medical stories from which modern medicine progresses. Anyways, thanks for reading all the way here if you did!`, 

  purposeText: `I have built this website because I believe that the progress of science and medicine depends on open communication and the shared use of resources. No discovery happens in a vacuum, and I want to collaborate with others to see these fields succeed. This space is a place for me to share my own thoughts as well as the work of others that I find particularly important, useful, or interesting.

  You can explore my Publications for a look at my research, or visit the Artwork and Photography tabs to see how I use visual media as a storytelling device for science and the human system. I welcome collaborations and discussions at any time, and I look forward to connecting with anyone who shares a commitment to advancing the next wave of biomedical science.`
};
