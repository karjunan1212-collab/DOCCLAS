import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, ProcessingStep } from '../../services/document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-design-arya-intelligence',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './design-arya-intelligence.component.html',
  styleUrls: ['./design-arya-intelligence.component.css']
})
export class DesignAryaIntelligenceComponent implements OnInit, OnDestroy {
  steps: ProcessingStep[] = [];
  private subscription: Subscription = new Subscription();
  uploadedFileName = '';

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
        await this.documentService.executeNextStep(stepIndex);
      }
    }
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

  getStepIcon(stepIndex: number): string {
    const icons = ['🤖', '📤', '📋', '🔍', '✓', '🛡️'];
    return icons[stepIndex] || '📌';
  }

  isAllCompleted(): boolean {
    return this.steps.every(s => s.isCompleted);
  }

  getCompletedCount(): number {
    return this.steps.filter(s => s.isCompleted).length;
  }

  getStepDescription(stepIndex: number): string {
    const descriptions = [
      'AI intake & document preparation',
      'Fast, multi-format intake\n(PDFs, images, scans, etc.)',
      'Identifies type:\nBank Statement, ID, Payslip, Utility Bill, etc.',
      'OCR + NLP to extract relevant fields\n(name, income, account number, etc.)',
      'Cross-verifies across documents\n(e.g., salary in payslip vs. bank deposit)',
      'Detects tampered documents, duplicates, transactions, and verifies IDs.'
    ];
    return descriptions[stepIndex] || '';
  }

  resetProcess(): void {
    this.uploadedFileName = '';
    window.location.reload();
  }
}
