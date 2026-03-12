import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, ProcessingStep } from '../../services/document.service';

@Component({
  selector: 'app-design-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './design-dashboard.component.html',
  styleUrls: ['./design-dashboard.component.css']
})
export class DesignDashboardComponent implements OnInit {
  steps: ProcessingStep[] = [];
  processing = false;
  allCompleted = false;
  uploadedFileName = '';
  completedCount = 0;
  pendingCount = 5;
  currentActiveStep: ProcessingStep | undefined;

  constructor(public documentService: DocumentService) {}

  ngOnInit(): void {
    this.documentService.steps$.subscribe(steps => {
      this.steps = steps;
      this.allCompleted = this.documentService.isAllCompleted();
      this.completedCount = steps.filter(s => s.isCompleted).length;
      this.pendingCount = steps.filter(s => !s.isCompleted).length;
      this.currentActiveStep = steps.find(s => s.isProcessing);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.uploadedFileName = file.name;
      this.documentService.uploadDocument(file);
    }
  }

  async executeNextStep(): Promise<void> {
    const nextStepIndex = this.steps.findIndex(step => !step.isCompleted && !step.isProcessing);
    if (nextStepIndex === -1) return;
    
    this.processing = true;
    await this.documentService.executeNextStep(nextStepIndex);
    this.processing = false;
  }

  resetProcess(): void {
    this.uploadedFileName = '';
    window.location.reload();
  }
}
