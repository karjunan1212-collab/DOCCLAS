import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, ProcessingStep } from '../../services/document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-design-digital-human',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './design-digital-human.component.html',
  styleUrls: ['./design-digital-human.component.css']
})
export class DesignDigitalHumanComponent implements OnInit, OnDestroy {
  steps: ProcessingStep[] = [];
  private subscription: Subscription = new Subscription();
  uploadedFileName = '';
  processingStepIndex = -1;

  capabilities = [
    { icon: '📡', label: 'Connectivity', position: 'top-left' },
    { icon: '👤', label: 'User Data', position: 'top' },
    { icon: '🔐', label: 'Security', position: 'top-right' },
    { icon: '💬', label: 'Communication', position: 'right-top' },
    { icon: '📄', label: 'Documents', position: 'right-bottom' },
    { icon: '🎯', label: 'Analysis', position: 'bottom-right' },
    { icon: '⚡', label: 'Processing', position: 'bottom' },
    { icon: '🧠', label: 'Intelligence', position: 'bottom-left' },
    { icon: '🔧', label: 'Integration', position: 'left-bottom' },
    { icon: '📊', label: 'Analytics', position: 'left-top' }
  ];

  constructor(public documentService: DocumentService) {}

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
      this.uploadedFileName = file.name;
      this.documentService.uploadDocument(file);
    }
  }

  async executeNextStep(stepIndex: number) {
    const currentStep = this.steps[stepIndex];
    if (currentStep && !currentStep.isCompleted && !currentStep.isProcessing) {
      if (this.isStepAvailable(stepIndex)) {
        this.processingStepIndex = stepIndex;
        await this.documentService.executeNextStep(stepIndex);
        this.processingStepIndex = -1;
      }
    }
  }

  isStepAvailable(stepIndex: number): boolean {
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

  isAllCompleted(): boolean {
    return this.steps.every(s => s.isCompleted);
  }

  getCompletedCount(): number {
    return this.steps.filter(s => s.isCompleted).length;
  }

  resetProcess(): void {
    this.uploadedFileName = '';
    window.location.reload();
  }
}
