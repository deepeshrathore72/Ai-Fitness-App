import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { UserFormData } from "@/types/form"

export async function exportToPDF(workoutPlan: any, dietPlan: any, formData: UserFormData | null) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(196, 255, 14);
  doc.text('FitCoach AI - Fitness Plan', 105, 20, { align: 'center' });
  
  // User Info
  if (formData) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${formData.name}`, 20, 35);
    doc.text(`Age: ${formData.age} | Gender: ${formData.gender}`, 20, 42);
    doc.text(`Goal: ${formData.fitnessGoal} | Level: ${formData.fitnessLevel}`, 20, 49);
  }
  
  let yPos = 60;
  
  // Workout Plan
  doc.setFontSize(18);
  doc.setTextColor(196, 255, 14);
  doc.text('Workout Plan', 20, yPos);
  yPos += 10;
  
  workoutPlan.forEach((day: any, index: number) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Day header
    doc.setFillColor(196, 255, 14);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(day.day, 22, yPos);
    yPos += 12;
    
    // Exercises table
    const exercises = day.exercises.map((ex: any) => [
      ex.name,
      `${ex.sets} sets`,
      ex.reps,
      ex.rest
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Exercise', 'Sets', 'Reps', 'Rest']],
      body: exercises,
      theme: 'grid',
      headStyles: { fillColor: [196, 255, 14], textColor: [0, 0, 0] },
      margin: { left: 20, right: 20 },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  });
  
  // Diet Plan
  doc.addPage();
  yPos = 20;
  
  doc.setFontSize(18);
  doc.setTextColor(196, 255, 14);
  doc.text('Diet Plan', 20, yPos);
  yPos += 10;
  
  dietPlan.forEach((day: any) => {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    // Day header
    doc.setFillColor(196, 255, 14);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(day.day, 22, yPos);
    yPos += 12;
    
    // Meals - extract name from object if needed
    const dayMeals = day.meals || day
    const getMealName = (meal: any) => {
      if (typeof meal === 'string') return meal
      return meal?.name || 'Not specified'
    }
    
    const totalCalories = day.calories || 
      (dayMeals.breakfast?.calories || 0) +
      (dayMeals.lunch?.calories || 0) +
      (dayMeals.dinner?.calories || 0) +
      (dayMeals.snacks?.calories || 0)
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    
    const meals = [
      ['Breakfast', getMealName(dayMeals.breakfast)],
      ['Lunch', getMealName(dayMeals.lunch)],
      ['Dinner', getMealName(dayMeals.dinner)],
      ['Snacks', getMealName(dayMeals.snacks)],
      ['Calories', `${totalCalories} kcal`]
    ];
    
    autoTable(doc, {
      startY: yPos,
      body: meals,
      theme: 'plain',
      styles: { cellPadding: 3, fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 30 },
        1: { cellWidth: 140 }
      },
      margin: { left: 20, right: 20 },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  });
  
  // Save PDF
  doc.save(`FitCoach-AI-Plan-${new Date().getTime()}.pdf`);
}
