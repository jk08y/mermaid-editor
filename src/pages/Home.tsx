// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DiagramTemplate, DiagramType } from '../types';
import { useDiagramStorage } from '../hooks/useDiagramStorage';

const Home: React.FC = () => {
  const { diagrams } = useDiagramStorage();
  const [activeDemo, setActiveDemo] = useState<number>(0);
  
  // Example diagram templates
  const templates: DiagramTemplate[] = [
    {
      type: 'flowchart',
      name: 'Flowchart',
      description: 'Visualize workflow processes with decision points',
      template: `flowchart TD
    Start([Start]) --> Process1[Process step]
    Process1 --> Decision{Decision?}
    Decision -->|Yes| Process2[Process step 2]
    Decision -->|No| Process3[Process step 3]
    Process2 --> End([End])
    Process3 --> End`
    },
    {
      type: 'sequenceDiagram',
      name: 'Sequence Diagram',
      description: 'Show interactions between systems over time',
      template: `sequenceDiagram
    participant User
    participant System
    participant Database
    
    User->>System: Request data
    System->>Database: Query data
    Database-->>System: Return results
    System-->>User: Display results`
    },
    {
      type: 'classDiagram',
      name: 'Class Diagram',
      description: 'Model object-oriented structures and relationships',
      template: `classDiagram
    class Animal {
      +name: string
      +age: int
      +makeSound() void
    }
    class Dog {
      +breed: string
      +fetch() void
    }
    class Cat {
      +color: string
      +climb() void
    }
    Animal <|-- Dog
    Animal <|-- Cat`
    },
    {
      type: 'stateDiagram',
      name: 'State Diagram',
      description: 'Represent system states and transitions',
      template: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Complete: Success
    Processing --> Error: Failure
    Complete --> [*]
    Error --> Idle: Retry`
    },
    {
      type: 'erDiagram',
      name: 'ER Diagram',
      description: 'Model database entities and relationships',
      template: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int order_id
        date created_at
    }
    LINE-ITEM {
        string product_id
        int quantity
        float price
    }`
    },
    {
      type: 'gantt',
      name: 'Gantt Chart',
      description: 'Plan and track project timelines',
      template: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    
    section Planning
    Requirements gathering  :a1, 2023-01-01, 7d
    System design           :a2, after a1, 10d
    
    section Development
    Frontend implementation :b1, after a2, 15d
    Backend implementation  :b2, after a2, 12d
    
    section Testing
    Integration testing     :c1, after b1, 5d
    User testing            :c2, after c1, 5d`
    }
  ];

  // Group diagrams by category for template gallery
  const diagramCategories = {
    'Process Flows': templates.filter(t => ['flowchart', 'stateDiagram'].includes(t.type)),
    'System Architecture': templates.filter(t => ['sequenceDiagram', 'classDiagram'].includes(t.type)),
    'Data Modeling': templates.filter(t => ['erDiagram'].includes(t.type)),
    'Project Planning': templates.filter(t => ['gantt'].includes(t.type))
  };

  const createNewWithTemplate = (template: string) => {
    return `/editor?template=${encodeURIComponent(template)}`;
  };
  
  // Rotate through demo examples
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % templates.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [templates.length]);

  // Features list
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Code-Based Editing',
      description: "Create diagrams using simple text-based syntax that is easy to learn, maintain, and version control."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      title: 'Multiple Diagram Types',
      description: 'Support for flowcharts, sequence diagrams, class diagrams, ER diagrams, Gantt charts, and more.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: 'Live Preview',
      description: 'See your diagram update in real-time as you type with instant visual feedback.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Export Options',
      description: 'Export diagrams as SVG or PNG images for use in documents, presentations, and websites.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Automatic Saving',
      description: 'Never lose your work with automatic saves and a complete history of your diagrams.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: 'Customizable Themes',
      description: 'Switch between light and dark modes for comfortable editing in any environment.'
    }
  ];

  return (
    <div className="pb-16">
      {/* Hero section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-white to-neutral-50 dark:from-dark-background dark:to-dark-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
                Create Beautiful Diagrams <span className="text-primary-600 dark:text-primary-400">with Code</span>
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8">
                Design professional diagrams effortlessly using Mermaid's simple text-based syntax. Perfect for developers, product managers, and technical documentation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/editor" className="btn btn-primary px-6 py-3 text-base flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Start Diagramming
                </Link>
                <a 
                  href="https://mermaid.js.org/intro/getting-started.html" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary px-6 py-3 text-base flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Learn Syntax
                </a>
              </div>
              <div className="mt-6 flex items-center">
                <div className="relative">
                  <div className="flex -space-x-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full bg-primary-${(i + 1) * 100} border-2 border-white dark:border-dark-background flex items-center justify-center text-xs font-bold text-primary-900 dark:text-primary-100`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ml-3 text-sm text-neutral-500 dark:text-neutral-400">
                  <span className="font-medium">1,000+</span> users have created diagrams today
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-elevation-3 border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-surface transition-all duration-300">
                {/* Editor Header with Window Controls */}
                <div className="flex items-center px-4 py-2 bg-neutral-100 dark:bg-dark-background border-b border-neutral-200 dark:border-dark-border">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    Mermaid Editor
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-1/2 border-r border-neutral-200 dark:border-dark-border p-4 bg-neutral-50 dark:bg-dark-background">
                    <div className="font-mono text-sm text-neutral-800 dark:text-neutral-200 overflow-hidden whitespace-pre">
                      {templates[activeDemo].template}
                    </div>
                  </div>
                  <div className="w-1/2 p-4 flex items-center justify-center">
                    <div className="text-neutral-400 dark:text-neutral-500 text-center">
                      <div className="text-sm mb-1">Live Preview</div>
                      <div className="text-xs">Auto-updates as you type</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {templates[activeDemo].name}
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-1">
                  {templates.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveDemo(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeDemo 
                          ? 'bg-primary-500 w-4' 
                          : 'bg-neutral-300 dark:bg-neutral-600'
                      }`}
                      aria-label={`Show demo ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Key Features</h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Everything you need to create professional diagrams in minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-dark-border transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full inline-flex mb-4 text-primary-600 dark:text-primary-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Gallery */}
      <section className="py-16 px-4 bg-neutral-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Template Gallery</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Jump-start your diagrams with our pre-made templates
            </p>
          </div>

          {Object.entries(diagramCategories).map(([category, categoryTemplates], index) => (
            <div key={category} className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white flex items-center">
                <span className="w-2 h-6 bg-primary-500 rounded-full mr-2" aria-hidden="true"></span>
                {category}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTemplates.map((template, templateIndex) => (
                  <Link 
                    key={`${category}-${templateIndex}`}
                    to={createNewWithTemplate(template.template)}
                    className="card card-hover group"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-lg font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {template.name}
                        </h4>
                        <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                          {template.type}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {template.description}
                      </p>
                      <div className="text-primary-600 dark:text-primary-400 text-sm flex items-center font-medium">
                        <span>Use template</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your diagrams */}
      {diagrams.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Your Recent Diagrams</h2>
              <Link to="/saved" className="text-primary-600 dark:text-primary-400 font-medium flex items-center hover:underline">
                View all diagrams
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {diagrams.slice(0, 4).map((diagram) => (
                <Link
                  key={diagram.id}
                  to={`/editor/${diagram.id}`}
                  className="card card-hover overflow-hidden group"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-neutral-100 dark:bg-dark-background">
                    {diagram.previewImage ? (
                      <img
                        src={diagram.previewImage}
                        alt={diagram.title || 'Untitled Diagram'}
                        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-neutral-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {diagram.title || 'Untitled Diagram'}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {new Date(diagram.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="mt-8 mb-16 px-4">
        <div className="max-w-5xl mx-auto bg-primary-600 dark:bg-primary-900 rounded-2xl overflow-hidden shadow-elevation-2">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 p-8 md:p-10">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to create your diagram?</h2>
              <p className="text-primary-100 max-w-lg mb-8">
                Start from scratch or use one of our templates to build your diagram today. No account required.
              </p>
              <Link to="/editor" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-white">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Get Started Now
              </Link>
            </div>
            <div className="md:w-1/3 bg-primary-700 dark:bg-primary-800 flex items-center justify-center p-6">
              <svg className="w-full h-auto max-w-xs opacity-10" viewBox="0 0 24 24" fill="currentColor" color="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;