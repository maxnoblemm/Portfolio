
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  image: string;
  type: 'Project' | 'Publication' ;
}

export interface ArtWork {
  id: string;
  title: string;
  client?: string;
  image: string;
}

export interface Photography {
  id: string;
  title: string;
  location: string;
  image: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'R' | 'QuickNII' | 'Wet Lab' ;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
}

export type AppView = 'home' | 'about me' | 'bioinformatics' | 'publications' | 'artwork' | 'photography';
