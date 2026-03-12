import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs'; // uncomment when enabling real HTTP calls

export interface ProcessingStep {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  isProcessing: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private processingSteps: ProcessingStep[] = [
    { id: 1, name: 'Upload Document', description: 'AI agent analyzes document structure and content', isCompleted: false, isProcessing: false },
    { id: 2, name: 'Document Validator', description: 'Agent evaluates lending risks and compliance', isCompleted: false, isProcessing: false },
    { id: 3, name: 'OCR', description: 'Agent extracts key financial data and information', isCompleted: false, isProcessing: false },
    { id: 4, name: 'Document Classification', description: 'Agent validates extracted data against lending criteria', isCompleted: false, isProcessing: false },
    { id: 5, name: 'Download', description: 'Agent provides final lending decision and recommendations', isCompleted: false, isProcessing: false }
  ];

  private stepsSubject = new BehaviorSubject<ProcessingStep[]>(this.processingSteps);
  public steps$ = this.stepsSubject.asObservable();

  private uploadedFile: File | null = null;
  private currentStepIndex = 0;
  private stepMessages: string[] = this.processingSteps.map(() => '');
  private stepMessagesSubject = new BehaviorSubject<string[]>([...this.stepMessages]);
  public stepMessages$ = this.stepMessagesSubject.asObservable();

  constructor(private http: HttpClient) { }

  uploadDocument(file: File): void {
    this.uploadedFile = file;
    this.resetSteps();
  }

  getUploadedFile(): File | null {
    return this.uploadedFile;
  }

  getSteps(): ProcessingStep[] {
    return this.processingSteps;
  }

  executeNextStep(stepIndex: number): Promise<boolean> {
    if (stepIndex < this.processingSteps.length) {
      const currentStep = this.processingSteps[stepIndex];
      currentStep.isProcessing = true;
      this.stepsSubject.next([...this.processingSteps]);

      return this.executeScript(currentStep).then(() => {
        currentStep.isProcessing = false;
        currentStep.isCompleted = true;
        this.stepsSubject.next([...this.processingSteps]);
        return true;
      });
    }
    return Promise.resolve(false);
  }

  markStepCompleted(stepIndex: number): void {
    if (stepIndex < this.processingSteps.length) {
      this.processingSteps[stepIndex].isCompleted = true;
      this.stepsSubject.next([...this.processingSteps]);
    }
  }

  private setCurrentStep(index: number): void {
    this.currentStepIndex = index;
    this.processingSteps[index].isProcessing = true;
    this.stepsSubject.next([...this.processingSteps]);
  }

  private resetSteps(): void {
    this.processingSteps.forEach(step => {
      step.isCompleted = false;
      step.isProcessing = false;
    });
    this.currentStepIndex = 0;
  }

  private apiForStep(stepId: number) {
    //const base = 'http://127.0.0.1:8000'; // replace with environment var
    const base = '/api';
    return {
      1: { url: `${base}/upload`, returnsBlob: false },
      2: { url: `${base}/getdoc`, returnsBlob: false },
      3: { url: `${base}/getocr`, returnsBlob: false },
      4: { url: `${base}/getclassify`, returnsBlob: false },
      5: { url: `${base}/export`, returnsBlob: true }
    }[stepId];
  }

  private async executeScript(step: ProcessingStep): Promise<boolean> {
    console.log(`Executing script/API for: ${step.name}`);

    // Prepare payload
    const form = new FormData();
    if (this.uploadedFile) {
      form.append('file', this.uploadedFile, this.uploadedFile.name);
    }
    form.append('stepName', step.name);

    // Example API mapping (actual HTTP calls are commented out for now)
    const api = this.apiForStep(step.id);
    if (api) {
      try {
        if (api.returnsBlob) {
          //const blob = await firstValueFrom(this.http.post(api.url, form, { responseType: 'blob' }));
          const blob = await firstValueFrom(this.http.get(api.url, { responseType: 'blob' }));
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = this.uploadedFile?.name ?? 'result.bin';
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
          // set a friendly message for download step
          this.stepMessages[step.id - 1] = 'Download ready';
          this.stepMessagesSubject.next([...this.stepMessages]);
        } else {
          //const res: any = await firstValueFrom(this.http.post(api.url, form));
          const res: any = await firstValueFrom(this.http.get(api.url));
          // if server returns { message: '...' } publish it to the UI for this step
          try {
            const msg = (res && res.message) ? String(res.message) : JSON.stringify(res || {});
            this.stepMessages[step.id - 1] = msg;
          } catch (e) {
            this.stepMessages[step.id - 1] = 'Response received';
          }
          this.stepMessagesSubject.next([...this.stepMessages]);
        }
        return true;
      } catch (err) {
        console.error('API error for step', step.name, err);
        this.stepMessages[step.id - 1] = 'API request failed';
        this.stepMessagesSubject.next([...this.stepMessages]);
        return false;
      }
    }

    // For now, simulate the API/script with a short delay
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // console.log(`Simulated execution completed for: ${step.name}`);
    return false;
  }

  isAllCompleted(): boolean {
    return this.processingSteps.every(step => step.isCompleted);
  }

  canProcessNext(): boolean {
    return this.uploadedFile !== null && this.currentStepIndex < this.processingSteps.length;
  }
}
