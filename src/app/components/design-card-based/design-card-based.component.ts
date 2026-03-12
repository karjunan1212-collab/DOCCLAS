import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, ProcessingStep } from '../../services/document.service';

@Component({
  selector: 'app-design-card-based',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './design-card-based.component.html',
  styleUrls: ['./design-card-based.component.css']
})
export class DesignCardBasedComponent implements OnInit {
  steps: ProcessingStep[] = [];
  processing = false;
  allCompleted = false;
  uploadedFileName = '';
  progressPercentage = 0;

  constructor(public documentService: DocumentService) {}

  ngOnInit(): void {
    this.documentService.steps$.subscribe(steps => {
      this.steps = steps;
      this.allCompleted = this.documentService.isAllCompleted();
      this.calculateProgress();
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

  calculateProgress(): void {
    const completed = this.steps.filter(s => s.isCompleted).length;
    this.progressPercentage = (completed / this.steps.length) * 100;
  }

  resetProcess(): void {
    this.uploadedFileName = '';
    window.location.reload();
  }
}
