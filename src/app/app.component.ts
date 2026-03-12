import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignMinimalistComponent } from './components/design-minimalist/design-minimalist.component';
import { DesignCardBasedComponent } from './components/design-card-based/design-card-based.component';
import { DesignTimelineComponent } from './components/design-timeline/design-timeline.component';
import { DesignCircularComponent } from './components/design-circular/design-circular.component';
import { DesignDashboardComponent } from './components/design-dashboard/design-dashboard.component';
import { DesignAiAgentsComponent } from './components/design-ai-agents/design-ai-agents.component';
import { DesignAryaIntelligenceComponent } from './components/design-arya-intelligence/design-arya-intelligence.component';
import { DesignAiAgentsRadialComponent } from './components/design-ai-agents-radial/design-ai-agents-radial.component';
import { DesignDigitalHumanComponent } from './components/design-digital-human/design-digital-human.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DesignMinimalistComponent,
    DesignCardBasedComponent,
    DesignTimelineComponent,
    DesignCircularComponent,
    DesignDashboardComponent,
    DesignAiAgentsComponent,
    DesignAryaIntelligenceComponent,
    DesignAiAgentsRadialComponent,
    DesignDigitalHumanComponent
  ],
  template: `
    <div class="app-wrapper" [class.design-selected]="selectedDesign">
      <!-- Design Selection Screen -->
      <div *ngIf="!selectedDesign" class="design-selector">
        <div class="selector-header">
          <h1>Choose Your Document Processing Design</h1>
          <p>Select one of the 9 available UI designs to get started</p>
        </div>

        <div class="designs-grid">
          <div *ngFor="let design of designs" class="design-card" (click)="selectDesign(design.id)">
            <div class="design-preview" [class]="'preview-' + design.id">
              <div class="preview-icon">{{ design.icon }}</div>
            </div>
            <h3 class="design-name">{{ design.name }}</h3>
            <p class="design-description">{{ design.description }}</p>
            <button class="design-btn">Select Design →</button>
          </div>
        </div>
      </div>

      <!-- Design 1: Modern Minimalist -->
      <app-design-minimalist *ngIf="selectedDesign === 1"></app-design-minimalist>

      <!-- Design 2: Card-Based -->
      <app-design-card-based *ngIf="selectedDesign === 2"></app-design-card-based>

      <!-- Design 3: Timeline -->
      <app-design-timeline *ngIf="selectedDesign === 3"></app-design-timeline>

      <!-- Design 4: Circular -->
      <app-design-circular *ngIf="selectedDesign === 4"></app-design-circular>

      <!-- Design 5: Dashboard -->
      <app-design-dashboard *ngIf="selectedDesign === 5"></app-design-dashboard>

      <!-- Design 6: AI Agents -->
      <app-design-ai-agents *ngIf="selectedDesign === 6"></app-design-ai-agents>

      <!-- Design 7: Arya Intelligence -->
      <app-design-arya-intelligence *ngIf="selectedDesign === 7"></app-design-arya-intelligence>

      <!-- Design 8: AI Agents Radial -->
      <app-design-ai-agents-radial *ngIf="selectedDesign === 8"></app-design-ai-agents-radial>

      <!-- Design 9: Digital Human -->
      <app-design-digital-human *ngIf="selectedDesign === 9"></app-design-digital-human>

      <!-- Back button removed: app opens directly into the selected design -->
    </div>
  `,
  styles: [`
    .app-wrapper {
      min-height: 100vh;
    }

    .design-selector {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 60px 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .selector-header {
      text-align: center;
      color: white;
      margin-bottom: 60px;
    }

    .selector-header h1 {
      font-size: 2.8rem;
      margin: 0 0 15px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .selector-header p {
      font-size: 1.1rem;
      margin: 0;
      opacity: 0.9;
    }

    .designs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .design-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }

    .design-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }

    .design-preview {
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.5rem;
      color: white;
      font-weight: 700;
    }

    .preview-1 {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .preview-2 {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .preview-3 {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .preview-4 {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .preview-5 {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .preview-6 {
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    }

    .preview-7 {
      background: linear-gradient(135deg, #1e5a7a 0%, #2a7ba3 100%);
    }

    .preview-8 {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .preview-9 {
      background: linear-gradient(135deg, #0a0e27 0%, #1a1a3a 50%, #0d1b2a 100%);
      position: relative;
    }

    .preview-9::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(0, 255, 255, 0.3) 0%, transparent 50%);
      border-radius: inherit;
    }

    .design-name {
      font-size: 1.3rem;
      font-weight: 700;
      color: #333;
      padding: 20px 20px 8px;
      margin: 0;
    }

    .design-description {
      font-size: 0.9rem;
      color: #666;
      padding: 0 20px 20px;
      margin: 0;
      flex: 1;
      line-height: 1.6;
    }

    .design-btn {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
      border-top: 1px solid #e8ecf1;
      padding: 14px 20px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
      text-align: center;
    }

    .design-card:hover .design-btn {
      background: #667eea;
      color: white;
    }

    .back-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      padding: 12px 24px;
      font-size: 0.95rem;
      font-weight: 600;
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .back-btn:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }

    @media (max-width: 1024px) {
      .designs-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
    }

    @media (max-width: 640px) {
      .selector-header h1 {
        font-size: 2rem;
      }

      .designs-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent {
  selectedDesign = 8;

  designs = [
    {
      id: 1,
      name: 'Modern Minimalist',
      icon: '✨',
      description: 'Clean and simple design with horizontal step indicators. Perfect for a streamlined, modern look.'
    },
    {
      id: 2,
      name: 'Card-Based Design',
      icon: '🎨',
      description: 'Beautiful card-based layout with progress indicators. Great for showcasing each processing step visually.'
    },
    {
      id: 3,
      name: 'Timeline View',
      icon: '📅',
      description: 'Vertical timeline showing the workflow progression. Ideal for sequential step-by-step visualization.'
    },
    {
      id: 4,
      name: 'Circular Progress',
      icon: '⭕',
      description: 'Circular workflow visualization with steps around the progress circle. Unique and engaging design.'
    },
    {
      id: 5,
      name: 'Dashboard Style',
      icon: '📊',
      description: 'Comprehensive dashboard with multiple panels showing stats and workflow. Professional and data-rich.'
    },
    {
      id: 6,
      name: 'AI Agents',
      icon: '🤖',
      description: 'AI-powered agents processing documents with intelligent automation. Perfect for modern lending workflows.'
    },
    {
      id: 7,
      name: 'Arya Intelligence',
      icon: '🧠',
      description: 'AI Document Intelligence pipeline with workflow visualization and key benefits. Enterprise-ready lending solution.'
    },
    {
      id: 8,
      name: 'AI Agents Network',
      icon: '🕸️',
      description: 'Multi-agent circular network with intelligent document processing. Connected agents working in harmony.'
    },
    {
      id: 9,
      name: 'Digital Human',
      icon: '🧠',
      description: 'Neural network-powered digital human with multi-capability processing. Futuristic AI-driven intelligence.'
    }
  ];

  selectDesign(designId: number): void {
    this.selectedDesign = designId;
  }

  backToSelector(): void {
    this.selectedDesign = 0;
  }
}
