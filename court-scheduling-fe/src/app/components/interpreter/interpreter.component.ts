import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Court } from 'src/app/models/court';
import { Interpreter } from 'src/app/models/interpreter';
import { Language } from 'src/app/models/language';
import { AdminService } from 'src/app/services/admin/admin.service';
import { CodesService } from 'src/app/services/codes/codes.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-interpreter',
  templateUrl: './interpreter.component.html',
  styleUrls: ['./interpreter.component.css']
})
export class InterpreterComponent implements OnInit {

  fullName = '';
  language = '';
  level = '';
  phone = '';
  email = '';
  court = '';

  languages: Language[] = [];
  courtLocations: Court[] = [];

  constructor(
    private adminService: AdminService,
    private codesService: CodesService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.fetchCodes();
  }

  async save(): Promise<void> {
    if (this.missingFields().length > 0) {
      this.shakeMissingFields();
      this.toastService.show('Missing fields');
      return;
    }
    const model = new Interpreter('', this.fullName, this.language, +this.level, this.phone, this.email, 0);
    const submitted = await this.adminService.addNewInterpreter(model);
    if (submitted) {
      this.close();
      this.toastService.show('Interpreter added');
    } else {
      this.toastService.show('There was an error while creating interpreter');
    }
  }

  close(): void {
    this.adminService.closeAction();
  }

  async fetchCodes(): Promise<void> {
    this.courtLocations = await this.codesService.getCourts();
    this.languages = await this.codesService.getLanguages();
  }

  /**
   * Sets selectedLanguage on dropdown change
   * @param event new selection event
   */
  languageSelectionChanged(event: MatSelectChange): void {
    const selectedOption = this.languages.find(item => item.name === event.value);
    this.language = selectedOption.name;
  }

  /**
   * Sets selectedLocation on dropdown change
   * @param event new selection event
   */
  locationSelectionChanged(event: MatSelectChange): void {
    const selectedOption = this.courtLocations.find(item => item.name === event.value);
    this.court = selectedOption.name;
  }

  /**
   * Get a string array of missing fields
   */
  missingFields(): string[] {
    const missing: string[] = [];
    if (this.fullName.length < 1) {
      missing.push('fullName');
    }

    if (this.language.length < 1) {
      missing.push('language');
    }

    if (this.level.length < 1) {
      missing.push('level');
    }

    if (this.phone.length < 1) {
      missing.push('phone');
    }

    if (this.email.length < 1) {
      missing.push('email');
    }

    if (this.court.length < 1) {
      missing.push('court');
    }

    return missing;
  }

  // Missing fields animation
  /**
   * Get the id of first missing field and shake it
   */
  shakeMissingFields(): void {
    const missing = this.missingFields();
    if (missing.length < 1) {
      return;
    }
    this.shakeMissingField(missing[0]);
  }

  /**
   * shakes an alement based on id
   * @param id of element
   */
  shakeMissingField(id: string): void {
    const highlightClasses = ['animate__animated', 'animate__shakeX', 'missing'];
    this.addClassesToElement(id, highlightClasses, 2000);
  }

  /**
   * Add Css classes to an element and remove them after the specified time.
   * @param elementId id - string
   * @param classes css classes - string[]
   * @param removeAfterMilliSeconds milliseconds -  number
   */
  addClassesToElement(elementId: string, classes: string[], removeAfterMilliSeconds: number): void {
    const el = this.elementRef.nativeElement.querySelector(`#${elementId}`);
    if (el) {
      for (const cssClass of classes) {
        this.renderer.addClass(el, cssClass);
      }
      setTimeout(() => {
        for (const cssClass of classes) {
          this.renderer.removeClass(el, cssClass);
        }
      }, removeAfterMilliSeconds);
    }
  }
}
