import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, ProcessingStep } from '../../services/document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-design-ai-agents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './design-ai-agents.component.html',
  styleUrls: ['./design-ai-agents.component.css']
})
export class DesignAiAgentsComponent implements OnInit, OnDestroy {
  steps: ProcessingStep[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.subscription = this.documentService.steps$.subscribe(steps => {
      this.steps = steps;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.documentService.uploadDocument(file);
    }
  }

  async executeNextStep(stepIndex: number) {
    const currentStep = this.steps[stepIndex];
    if (currentStep && !currentStep.isCompleted && !currentStep.isProcessing) {
      // Start processing the step (service will handle the delay and completion)
      await this.documentService.executeNextStep(stepIndex);
    }
  }

  getAgentIcon(stepIndex: number): string {
    const icons = ['🤖', '📊', '🔍', '⚡', '✅'];
    return icons[stepIndex] || '🤖';
  }

  getProgressPercentage(): number {
    return (this.steps.filter(s => s.isCompleted).length / this.steps.length) * 100;
  }

  getCompletedCount(): number {
    return this.steps.filter(s => s.isCompleted).length;
  }

  isAllCompleted(): boolean {
    return this.steps.every(s => s.isCompleted);
  }

  isStepAvailable(stepIndex: number): boolean {
    // A step is available if all previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      if (!this.steps[i].isCompleted) {
        return false;
      }
    }
    return true;
  }

  trackByIndex(index: number): number {
    return index;
  }

  getAgentName(stepIndex: number): string {
    const names = ['AI Document Analyzer', 'Risk Assessment Agent', 'Compliance Checker', 'Loan Processor', 'Final Validator'];
    return names[stepIndex] || 'AI Agent';
  }
}