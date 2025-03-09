// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { DiagramTemplate, DiagramType } from '../types';

const Home: React.FC = () => {
  // Example diagram templates
  const templates: DiagramTemplate[] = [
    {
      type: 'flowchart',
      name: 'Flowchart',
      description: 'Visualize a process or workflow with decision points',
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
      description: 'Show interactions between participants over time',
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
      description: 'Display classes and their relationships',
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
      description: 'Represent states of a system and transitions',
      template: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Complete: Success
    Processing --> Error: Failure
    Complete --> [*]
    Error --> Idle: Retry`
    },
    {
      type: 'entityRelationshipDiagram',
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

  // Group diagrams by category
  const processFlowDiagrams = templates.filter(t => ['flowchart', 'stateDiagram'].includes(t.type));
  const systemDiagrams = templates.filter(t => ['sequenceDiagram', 'classDiagram', 'entityRelationshipDiagram'].includes(t.type));
  const planningDiagrams = templates.filter(t => ['gantt', 'userJourney'].includes(t.type));

  const createNewWithTemplate = (template: string) => {
    return `/editor?template=${encodeURIComponent(template)}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero section */}
      <section className="py-10 sm:py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Create Powerful Diagrams <span className="text-primary-600">Effortlessly</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Build flowcharts, sequence diagrams, class diagrams and more using simple text-based syntax with our Mermaid diagram editor.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/editor" className="btn btn-primary">
              Create New Diagram
            </Link>
            <Link to="/saved" className="btn btn-secondary">
              View Saved Diagrams
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-12 bg-gray-50 dark:bg-dark-surface rounded-xl my-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full inline-flex mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Code-Based Editing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create diagrams using simple text-based syntax that's easy to learn and maintain.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full inline-flex mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Multiple Diagram Types</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Support for flowcharts, sequence diagrams, class diagrams, Gantt charts, and more.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full inline-flex mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Export Options</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Save your diagrams as SVG or PNG images for use in documents and presentations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">Diagram Templates</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
          Start with one of our pre-made templates to quickly create the diagram you need.
        </p>
        
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Process Flow Diagrams</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {processFlowDiagrams.map((template) => (
              <Link 
                key={template.type}
                to={createNewWithTemplate(template.template)}
                className="card hover:bg-gray-50 dark:hover:bg-dark-background transition-colors"
              >
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{template.name}</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{template.description}</p>
                <div className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                  Use template →
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">System & Architecture Diagrams</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemDiagrams.map((template) => (
              <Link 
                key={template.type}
                to={createNewWithTemplate(template.template)}
                className="card hover:bg-gray-50 dark:hover:bg-dark-background transition-colors"
              >
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{template.name}</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{template.description}</p>
                <div className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                  Use template →
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Planning Diagrams</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {planningDiagrams.map((template) => (
              <Link 
                key={template.type}
                to={createNewWithTemplate(template.template)}
                className="card hover:bg-gray-50 dark:hover:bg-dark-background transition-colors"
              >
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{template.name}</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{template.description}</p>
                <div className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                  Use template →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 bg-primary-600 rounded-xl my-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to create your diagram?</h2>
        <p className="text-primary-100 max-w-2xl mx-auto mb-8">
          Start from scratch or use one of our templates to build your diagram today.
        </p>
        <Link to="/editor" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-white">
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default Home;