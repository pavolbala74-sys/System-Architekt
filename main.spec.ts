import Navigation from './components/Navigation'
import HeroSection from './components/sections/HeroSection'
import ProblemSection from './components/sections/ProblemSection'
import FieldsSection from './components/sections/FieldsSection'
import QuestionsSection from './components/sections/QuestionsSection'
import AnalysisSection from './components/sections/AnalysisSection'
import FlowVisualizationSection from './components/sections/FlowVisualizationSection'
import ToolsSection from './components/sections/ToolsSection'
import SystemsSection from './components/sections/SystemsSection'
import ResearchSection from './components/sections/ResearchSection'
import {
  PhilosophySection,
  ContactSection,
  Footer,
} from './components/sections/PhilosophyContactSections'

export default function Home() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <ProblemSection />
      <FieldsSection />
      <QuestionsSection />
      <AnalysisSection />
      <FlowVisualizationSection />
      <ToolsSection />
      <SystemsSection />
      <ResearchSection />
      <PhilosophySection />
      <ContactSection />
      <Footer />
    </main>
  )
}
