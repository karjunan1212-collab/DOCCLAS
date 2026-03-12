import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, ProcessingStep } from '../../services/document.service';

@Component({
  selector: 'app-design-circular',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './design-circular.component.html',
  styleUrls: ['./design-circular.component.css']
})
export class DesignCircularComponent implements OnInit {
  steps: ProcessingStep[] = [];
  processing = false;
  allCompleted = false;
  uploadedFileName = '';
  circlePercentage = 0;
  currentStepNumber = 0;

  constructor(public documentService: DocumentService) {}

  ngOnInit(): void {
    this.documentService.steps$.subscribe(steps => {
      this.steps = steps;
      this.allCompleted = this.documentService.isAllCompleted();
      this.updateCircleProgress();
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

  updateCircleProgress(): void {
    const completed = this.steps.filter(s => s.isCompleted).length;
    this.circlePercentage = (completed / this.steps.length) * 100;
    this.currentStepNumber = completed + 1;
  }

  resetProcess(): void {
    this.uploadedFileName = '';
    window.location.reload();
  }

  getRotation(index: number): number {
    return (index * 360) / this.steps.length;
  }
}
