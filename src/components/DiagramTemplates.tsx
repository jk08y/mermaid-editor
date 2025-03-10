// src/components/DiagramTemplates.tsx
import React, { useState } from 'react';
import { DiagramTemplate } from '../types';

interface DiagramTemplatesProps {
  onSelect: (template: string) => void;
  onClose: () => void;
}

const DiagramTemplates: React.FC<DiagramTemplatesProps> = ({ onSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Collection of templates organized by categories
  const templates: Record<string, DiagramTemplate[]> = {
    'Flowcharts': [
      {
        type: 'flowchart',
        name: 'Basic Flowchart',
        description: 'Simple top-down flowchart',
        template: `flowchart TD
    Start([Start]) --> Process1[Process step]
    Process1 --> Decision{Decision?}
    Decision -->|Yes| Process2[Process step 2]
    Decision -->|No| Process3[Process step 3]
    Process2 --> End([End])
    Process3 --> End`
      },
      {
        type: 'flowchart',
        name: 'Left to Right Flowchart',
        description: 'Horizontal flowchart with subgraphs',
        template: `flowchart LR
    A[Start] --> B{Is it a problem?}
    B -->|Yes| C[Troubleshoot]
    B -->|No| D[Continue]
    
    subgraph Troubleshooting
    C --> E{Can I fix it?}
    E -->|Yes| F[Fix it]
    E -->|No| G[Ask for help]
    end
    
    F --> D
    G --> D
    D --> H[End]`
      },
      {
        type: 'flowchart',
        name: 'Complex Flowchart',
        description: 'Advanced flowchart with styling',
        template: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Continue]
    B -->|No| D[Debug]
    
    D --> E{Error Found?}
    E -->|Yes| F[Fix Error]
    E -->|No| G[Escalate]
    
    F --> H{Fixed?}
    G --> I[Ask expert]
    H -->|Yes| C
    H -->|No| G
    I --> H
    C --> J[End]

    classDef success fill:#d4edda,stroke:#28a745,stroke-width:1px,color:#155724;
    classDef danger fill:#f8d7da,stroke:#dc3545,stroke-width:1px,color:#721c24;
    classDef warning fill:#fff3cd,stroke:#ffc107,stroke-width:1px,color:#856404;
    
    class C success;
    class D,G,I danger;
    class E,H warning;`
      }
    ],
    'Sequence Diagrams': [
      {
        type: 'sequenceDiagram',
        name: 'Basic Sequence',
        description: 'Simple communication between participants',
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
        type: 'sequenceDiagram',
        name: 'Advanced Sequence',
        description: 'With loops, notes and activation',
        template: `sequenceDiagram
    autonumber
    
    participant Client
    participant Server
    participant Auth
    participant DB
    
    Client->>Server: Request resource
    activate Server
    Server->>Auth: Validate token
    activate Auth
    
    alt Valid token
        Auth-->>Server: Token valid
        Server->>DB: Query data
        activate DB
        DB-->>Server: Return data
        deactivate DB
        Server-->>Client: Return resource
    else Invalid token
        Auth-->>Server: Invalid token
        Server-->>Client: 401 Unauthorized
    end
    
    deactivate Auth
    deactivate Server
    
    note over Client,Server: User authenticated
    
    loop Every 5 minutes
        Client->>Server: Keep-alive ping
        Server-->>Client: 200 OK
    end`
      }
    ],
    'Entity Relationship': [
      {
        type: 'erDiagram',
        name: 'Simple ER Diagram',
        description: 'Basic entities and relationships',
        template: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
        string address
    }
    ORDER {
        int orderID
        date created_at
        decimal total_amount
    }
    LINE-ITEM {
        string product_id
        int quantity
        decimal price
    }`
      },
      {
        type: 'erDiagram',
        name: 'Complex Database Schema',
        description: 'More entities and relationships',
        template: `erDiagram
    USER ||--o{ POST : creates
    USER ||--o{ COMMENT : writes
    USER {
        int id PK
        string username
        string email
        string password_hash
        date created_at
    }
    POST ||--o{ COMMENT : has
    POST {
        int id PK
        string title
        string content
        date published_at
        int author_id FK
    }
    COMMENT {
        int id PK
        string content
        date created_at
        int user_id FK
        int post_id FK
    }
    TAG ||--o{ POST_TAG : included_in
    POST ||--o{ POST_TAG : has
    TAG {
        int id PK
        string name
        string description
    }
    POST_TAG {
        int post_id FK
        int tag_id FK
    }`
      }
    ],
    'Class Diagrams': [
      {
        type: 'classDiagram',
        name: 'Basic Class Diagram',
        description: 'Simple class hierarchy',
        template: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    
    Animal: +String name
    Animal: +int age
    Animal: +makeSound()
    
    class Duck {
        +String beakColor
        +swim()
        +quack()
    }
    
    class Fish {
        -int sizeInFeet
        -canEat()
    }
    
    class Zebra {
        +bool is_wild
        +run()
    }`
      },
      {
        type: 'classDiagram',
        name: 'Design Patterns',
        description: 'Example with design patterns',
        template: `classDiagram
    class Subject {
        <<interface>>
        +registerObserver(Observer o)
        +removeObserver(Observer o)
        +notifyObservers()
    }
    
    class Observer {
        <<interface>>
        +update(float temp, float humidity, float pressure)
    }
    
    class DisplayElement {
        <<interface>>
        +display()
    }
    
    class WeatherData {
        -float temperature
        -float humidity
        -float pressure
        -List~Observer~ observers
        +registerObserver(Observer o)
        +removeObserver(Observer o)
        +notifyObservers()
        +setMeasurements(float temp, float humidity, float pressure)
    }
    
    class CurrentConditionsDisplay {
        -float temperature
        -float humidity
        -Subject weatherData
        +update(float temp, float humidity, float pressure)
        +display()
    }
    
    Subject <|.. WeatherData
    Observer <|.. CurrentConditionsDisplay
    DisplayElement <|.. CurrentConditionsDisplay
    WeatherData --> Observer
    CurrentConditionsDisplay --> Subject`
      }
    ],
    'State Diagrams': [
      {
        type: 'stateDiagram',
        name: 'Simple State Machine',
        description: 'Basic state transitions',
        template: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Complete: Success
    Processing --> Error: Failure
    Complete --> [*]
    Error --> Idle: Retry`
      },
      {
        type: 'stateDiagram',
        name: 'Complex State Diagram',
        description: 'With nested states and notes',
        template: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
    
    state Moving {
        [*] --> Slow
        Slow --> Fast
        Fast --> Slow
        
        state Fast {
            [*] --> Fast.Driving
            Fast.Driving --> Fast.Obstacle: Detect obstacle
            Fast.Obstacle --> Fast.Braking
            Fast.Braking --> [*]
        }
    }
    
    note right of Still : No movement
    note left of Crash : Catastrophic failure
    note bottom of Fast.Braking : Apply brakes quickly`
      }
    ],
    'Gantt Charts': [
      {
        type: 'gantt',
        name: 'Project Timeline',
        description: 'Basic project schedule',
        template: `gantt
    title Project Schedule
    dateFormat  YYYY-MM-DD
    
    section Planning
    Requirements gathering  :a1, 2023-01-01, 7d
    System design           :a2, after a1, 10d
    
    section Development
    Frontend implementation :b1, after a2, 15d
    Backend implementation  :b2, after a2, 12d
    
    section Testing
    Integration testing     :c1, after b1, 5d
    User testing            :c2, after c1, 5d
    
    section Deployment
    Deployment preparation  :d1, after c2, 3d
    Production release      :milestone, after d1, 0d`
      }
    ],
    'Misc Diagrams': [
      {
        type: 'pie',
        name: 'Pie Chart',
        description: 'Simple data visualization',
        template: `pie title Project Resource Allocation
    "Development" : 45
    "Testing" : 30
    "Documentation" : 15
    "Deployment" : 10`
      },
      {
        type: 'gitGraph',
        name: 'Git Graph',
        description: 'Visualize git workflow',
        template: `gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature/login
    checkout feature/login
    commit
    commit
    checkout develop
    merge feature/login
    commit
    checkout main
    merge develop
    commit`
      }
    ]
  };

  // Filter templates based on search term
  const filteredTemplates = Object.entries(templates).reduce<Record<string, DiagramTemplate[]>>(
    (acc, [category, categoryTemplates]) => {
      if (searchTerm) {
        const filtered = categoryTemplates.filter(template => 
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
          acc[category] = filtered;
        }
      } else {
        acc[category] = categoryTemplates;
      }
      return acc;
    },
    {}
  );

  // Get categories to display
  const categoriesToDisplay = Object.keys(filteredTemplates);
  
  // If no active category is selected, use the first one
  useEffect(() => {
    if (categoriesToDisplay.length > 0 && !activeCategory) {
      setActiveCategory(categoriesToDisplay[0]);
    }
  }, [categoriesToDisplay, activeCategory]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-surface rounded-xl shadow-elevation-3 max-w-5xl w-full max-h-[85vh] overflow-hidden animate-slide-up flex flex-col">
        {/* Header with search */}
        <div className="p-4 border-b border-neutral-200 dark:border-dark-border sticky top-0 bg-white dark:bg-dark-surface z-10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold">Diagram Templates</h3>
            <button 
              onClick={onClose} 
              className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-dark-hover"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm
                dark:bg-dark-surface dark:border-dark-border dark:text-white dark:placeholder-neutral-500"
            />
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Categories sidebar */}
          <div className="w-64 border-r border-neutral-200 dark:border-dark-border flex-shrink-0 overflow-y-auto">
            <nav className="space-y-1 p-2">
              {categoriesToDisplay.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeCategory === category
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-dark-hover'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {category}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Templates grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {searchTerm && Object.keys(filteredTemplates).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <svg className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h4 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">No templates found</h4>
                <p className="text-neutral-500 dark:text-neutral-400">
                  No templates match your search criteria. Try a different search term.
                </p>
              </div>
            ) : activeCategory && filteredTemplates[activeCategory] ? (
              <>
                <h4 className="text-lg font-medium mb-4 flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full bg-primary-500 mr-2" 
                    aria-hidden="true"
                  ></span>
                  {activeCategory}
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredTemplates[activeCategory].map((template, index) => (
                    <div 
                      key={`${activeCategory}-${index}`} 
                      className="card card-hover cursor-pointer group transition-all duration-200 hover:border-primary-400 dark:hover:border-primary-600"
                      onClick={() => onSelect(template.template)}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h5 className="text-lg font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {template.name}
                          </h5>
                          <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full font-medium">
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
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <p className="text-neutral-500 dark:text-neutral-400">
                  Select a category from the sidebar to view templates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramTemplates;