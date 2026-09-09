'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { EvidencePanel, EvidenceBadge } from '@/components/research/EvidenceBadge';
import { MetricCard } from '@/components/visualization/Charts';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, HelpCircle, Brain, Zap, GitBranch, Award, RefreshCw, MessageSquare } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; label: string; correct: boolean; explanation: string }[];
  concept: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'You doubled recurrent depth from 8 to 16 steps, but accuracy did not improve. What does this most likely suggest?',
    concept: 'Recurrent depth scaling',
    options: [
      { id: 'a', label: 'The task does not require more latent computation', correct: true, explanation: 'Simple tasks converge quickly; additional depth gives diminishing returns (Geiping et al., 2025).' },
      { id: 'b', label: 'The model is broken', correct: false, explanation: 'Not necessarily broken — this is expected behavior.' },
      { id: 'c', label: 'You should add more parameters instead', correct: false, explanation: 'More parameters ≠ more test-time compute. Recurrent depth is about inference compute.' },
      { id: 'd', label: 'Latent reasoning doesn\'t work', correct: false, explanation: 'It works, but has diminishing returns like any compute scaling.' },
    ],
  },
  {
    id: 'q2',
    question: 'Why might latent reasoning be harder to inspect than token-by-token reasoning?',
    concept: 'Observability trade-off',
    options: [
      { id: 'a', label: 'Hidden states are encrypted', correct: false, explanation: 'Not encrypted — just not human-readable.' },
      { id: 'b', label: 'The model hides its thoughts intentionally', correct: false, explanation: 'Not intentional — it\'s an architectural difference.' },
      { id: 'c', label: 'Intermediate computation stays in continuous vector space, not discrete language', correct: true, explanation: 'No natural language tokens are generated; interpretation requires probes/visualization tools.' },
      { id: 'd', label: 'Latent reasoning uses fewer neurons', correct: false, explanation: 'State dimension can be large; observability is about representation format.' },
    ],
  },
  {
    id: 'q3',
    question: 'In BDH, which component carries dynamic (short-term) memory?',
    concept: 'BDH architecture',
    options: [
      { id: 'a', label: 'Synaptic state (ρ)', correct: true, explanation: 'BDH stores short-term memory in synaptic state, not a separate KV cache (Pathway Explainer Ch.1).' },
      { id: 'b', label: 'Neuron activations', correct: false, explanation: 'Activations are transient; synapses carry memory.' },
      { id: 'c', label: 'Attention weights', correct: false, explanation: 'BDH doesn\'t use standard attention weights; attention emerges from synapses.' },
      { id: 'd', label: 'Token embeddings', correct: false, explanation: 'Embeddings are static parameters.' },
    ],
  },
  {
    id: 'q4',
    question: 'What changes when demonstrations are added in BDH-CQ?',
    concept: 'BDH-CQ mechanism',
    options: [
      { id: 'a', label: 'Model weights are updated via backprop', correct: false, explanation: 'No weight updates at inference time.' },
      { id: 'b', label: 'A new KV cache entry is appended', correct: false, explanation: 'BDH-CQ uses fixed-size recurrent memory, not growing KV cache.' },
      { id: 'c', label: 'Recurrent synaptic memory is updated sequentially', correct: true, explanation: 'Each demonstration updates the recurrent memory state via Hebbian-like updates (Engdahl et al., 2026).' },
      { id: 'd', label: 'The query is concatenated with demos', correct: false, explanation: 'Demos update memory first; query is processed separately with latent reasoning.' },
    ],
  },
  {
    id: 'q5',
    question: 'What is the difference between a toy simulation (like in this lab) and a reported BDH-CQ result?',
    concept: 'Evidence discipline',
    options: [
      { id: 'a', label: 'Toy uses less compute', correct: false, explanation: 'True but not the key difference.' },
      { id: 'b', label: 'Toy is more accurate', correct: false, explanation: 'Published results are from actual trained models.' },
      { id: 'c', label: 'Toy is a simplified pedagogical model; published results are from trained 150M-param BDH-CQ on ARC-AGI', correct: true, explanation: 'Toy: 64D linear recurrent net. BDH-CQ: 150M params, trained on ARC, 29.5% pass@2.' },
      { id: 'd', label: 'No difference — they\'re the same thing', correct: false, explanation: 'Critical distinction: toy illustrates mechanism; published result is empirical evidence.' },
    ],
  },
  {
    id: 'q6',
    question: 'In Coconut\'s "Chain of Continuous Thought", what replaces the language token in the reasoning loop?',
    concept: 'Latent reasoning mechanism',
    options: [
      { id: 'a', label: 'The last hidden state (continuous thought) fed directly as next input embedding', correct: true, explanation: 'Continuous thought = last hidden state used as next input embedding (Hao et al., 2024).' },
      { id: 'b', label: 'A special [THINK] token', correct: false, explanation: 'No special token — the hidden state itself is used.' },
      { id: 'c', label: 'A compressed latent vector from an autoencoder', correct: false, explanation: 'No separate autoencoder — uses the model\'s own hidden state.' },
      { id: 'd', label: 'Random noise for exploration', correct: false, explanation: 'Not random — it\'s the deterministic hidden state.' },
    ],
  },
  {
    id: 'q7',
    question: 'TRM (Tiny Recursive Model) achieves 45% ARC-AGI-1 with only 7M parameters. What is its key architectural insight?',
    concept: 'Recursive reasoning',
    options: [
      { id: 'a', label: 'Single 2-layer network with two latent variables (y=solution, z=memory) and recursive refinement', correct: true, explanation: 'TRM simplifies HRM: one network, two state variables, recursive updates (Jolicoeur-Martineau, 2025).' },
      { id: 'b', label: 'Two hierarchical networks at different timescales', correct: false, explanation: 'That\'s HRM. TRM uses a SINGLE tiny network.' },
      { id: 'c', label: 'Massive pre-training on synthetic data', correct: false, explanation: 'TRM trains on small data (~1000 examples).' },
      { id: 'd', label: 'Mixture of experts routing', correct: false, explanation: 'No MoE — just recursive application of one small network.' },
    ],
  },
];

interface AnswerState {
  questionId: string;
  selectedOption: string | null;
  isCorrect: boolean | null;
}

export default function ChallengePage() {
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [freeResponse, setFreeResponse] = useState('');
  const [freeResponseSubmitted, setFreeResponseSubmitted] = useState(false);
  const [freeResponseFeedback, setFreeResponseFeedback] = useState<string>('');
  
  const handleAnswer = (questionId: string, optionId: string) => {
    const question = QUIZ_QUESTIONS.find(q => q.id === questionId)!;
    const option = question.options.find(o => o.id === optionId)!;
    
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, selectedOption: optionId, isCorrect: option.correct } : a);
      }
      return [...prev, { questionId, selectedOption: optionId, isCorrect: option.correct }];
    });
  };
  
  const handleSubmit = () => {
    if (answers.length === QUIZ_QUESTIONS.length) {
      setSubmitted(true);
    }
  };
  
  const handleFreeResponseSubmit = () => {
    if (freeResponse.trim().length < 50) {
      setFreeResponseFeedback('Please write at least 50 characters to get meaningful feedback.');
      return;
    }
    setFreeResponseSubmitted(true);
    
    // Simple rubric-based feedback
    const keywords = [
      'latent state', 'hidden state', 'recurrent', 'repeated', 'iteration', 
      'token', 'visible', 'language', 'observe', 'inspect', 'interpret',
      'trade-off', 'compute', 'accuracy', 'memory', 'BDH', 'BDH-CQ',
      'demonstration', 'memory update', 'in-context', 'latent reasoning'
    ];
    
    const found = keywords.filter(k => freeResponse.toLowerCase().includes(k.toLowerCase()));
    const score = Math.min(5, found.length);
    
    let feedback = `You mentioned ${found.length} key concepts: ${found.join(', ')}. `;
    if (score >= 4) feedback += 'Excellent — you captured the core ideas!';
    else if (score >= 2) feedback += 'Good — consider mentioning latent state updates, observability trade-offs, and BDH/BDH-CQ connection.';
    else feedback += 'Try to include: latent state, recurrent updates, no visible tokens, trade-offs, BDH-CQ.';
    
    setFreeResponseFeedback(feedback);
  };
  
  const score = answers.filter(a => a.isCorrect).length;
  const total = QUIZ_QUESTIONS.length;
  
  return (
    <PageLayout title="Challenge Yourself" description="Test your understanding. Explain the central idea in your own words.">
      {/* Quiz Section */}
      <EvidencePanel type="TOY_PEDAGOGICAL" title="Concept Check Quiz" className="mb-6">
        <p className="text-lab-textMuted mb-4">
          Questions require reasoning, not recall. Select your answer to see the explanation.
        </p>
        
        <div className="space-y-6">
          {QUIZ_QUESTIONS.map((question, index) => {
            const answer = answers.find(a => a.questionId === question.id);
            const isAnswered = !!answer;
            const isCorrect = answer?.isCorrect;
            
            return (
              <div key={question.id} className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50">
                <div className="flex items-start gap-3 mb-3">
                  <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-lab-accentBg text-lab-accent text-sm font-mono">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-display text-sm text-lab-text">{question.question}</h4>
                    <span className="badge badge-toy">{question.concept}</span>
                  </div>
                </div>
                
                <div className="space-y-2 ml-9">
                  {question.options.map((option) => {
                    const isSelected = answer?.selectedOption === option.id;
                    const showResult = isAnswered && (isSelected || option.correct);
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => !isAnswered && handleAnswer(question.id, option.id)}
                        disabled={isAnswered}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border transition-all text-sm',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent',
                          isAnswered
                            ? option.correct
                              ? 'bg-lab-accentBg/50 border-lab-accent text-lab-accent'
                              : isSelected
                                ? 'bg-lab-dangerBg/50 border-lab-danger text-lab-danger'
                                : 'opacity-60'
                            : 'bg-lab-panel/50 border-lab-border hover:border-lab-borderBright hover:bg-lab-panel'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                            isAnswered && option.correct && 'bg-lab-accent border-lab-accent',
                            isAnswered && isSelected && !option.correct && 'bg-lab-danger border-lab-danger',
                            !isAnswered && 'border-lab-border'
                          )}>
                            {isAnswered && option.correct && <CheckCircle className="w-3 h-3 text-lab-bg" />}
                            {isAnswered && isSelected && !option.correct && <XCircle className="w-3 h-3 text-lab-bg" />}
                          </span>
                          <span>{option.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {isAnswered && (
                  <div className={cn(
                    'mt-3 p-3 rounded-lg text-sm animate-in',
                    isCorrect ? 'bg-lab-accentBg/30 border border-lab-accent/30' : 'bg-lab-dangerBg/30 border border-lab-danger/30'
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-lab-accent" />
                      ) : (
                        <XCircle className="w-4 h-4 text-lab-danger" />
                      )}
                      <span className="font-medium">
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-lab-textMuted">{question.options.find(o => o.id === answer?.selectedOption)?.explanation || question.options.find(o => o.correct)?.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {submitted && (
          <div className="mt-6 p-6 rounded-xl text-center" style={{ 
            background: score === total ? 'linear-gradient(135deg, #052e26, #0a3d2e)' : 'linear-gradient(135deg, #3d1a1a, #4a1a1a)',
            border: `2px solid ${score === total ? '#00d4aa' : '#ff6b6b'}`,
          }}>
            <h3 className="font-display text-2xl font-semibold text-lab-text mb-2">
              {score === total ? '🎉 Perfect Score!' : `Score: ${score}/${total}`}
            </h3>
            <p className="text-lab-textMuted">
              {score === total 
                ? 'You\'ve mastered the core concepts!' 
                : 'Review the explanations above and try again.'}
            </p>
            <button 
              onClick={() => { setAnswers([]); setSubmitted(false); }}
              className="btn-secondary mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Quiz
            </button>
          </div>
        )}
      </EvidencePanel>
      
      {/* Free Response */}
      <EvidencePanel type="TOY_PEDAGOGICAL" title="Explain in Your Own Words" className="mb-6">
        <p className="text-lab-textMuted mb-4">
          Write a 300-character explanation of the central idea. This helps consolidate your understanding.
        </p>
        
        <textarea
          value={freeResponse}
          onChange={(e) => setFreeResponse(e.target.value)}
          disabled={freeResponseSubmitted}
          className="input-field min-h-[100px] font-sans text-sm"
          placeholder="The core idea is that AI reasoning doesn't require generating more text tokens. Instead, a recurrent architecture can repeatedly update a hidden state in latent space, performing additional computation without producing a longer verbal chain-of-thought. This changes the accuracy/latency/cost/observability trade-offs. BDH reorganizes Transformer attention into synaptic memory with local computation, and BDH-CQ adds in-context learning by updating recurrent memory from demonstrations before running latent reasoning on queries. Key trade-off: more compute inside the state, but less directly observable reasoning."
          maxLength={500}
        />
        <div className="flex items-center justify-between mt-2">
          <span className={cn('text-sm font-mono', freeResponse.length > 300 ? 'text-lab-warning' : 'text-lab-textMuted')}>
            {freeResponse.length}/300 chars
          </span>
          <button 
            onClick={handleFreeResponseSubmit}
            disabled={freeResponseSubmitted || freeResponse.length < 50}
            className="btn-primary"
          >
            {freeResponseSubmitted ? 'Submitted' : 'Get Feedback'}
          </button>
        </div>
        
        {freeResponseSubmitted && (
          <div className="mt-4 p-4 rounded-lg bg-lab-panel/50 border border-lab-border/50 animate-in">
            <h5 className="font-display text-sm text-lab-text mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-lab-info" />
              Feedback (Transparent Rubric)
            </h5>
            <p className="text-sm text-lab-textMuted">{freeResponseFeedback}</p>
            <details className="mt-2">
              <summary className="text-xs text-lab-textMuted font-mono cursor-pointer">Rubric</summary>
              <ul className="list-disc list-inside text-xs text-lab-textMuted mt-1 space-y-1">
                <li>✓ Mentions latent/hidden state</li>
                <li>✓ Describes repeated/recurrent updates</li>
                <li>✓ Notes no requirement for visible reasoning tokens</li>
                <li>✓ Identifies trade-offs (accuracy/latency/cost/observability)</li>
                <li>✓ Connects to BDH and/or BDH-CQ</li>
              </ul>
            </details>
          </div>
        )}
      </EvidencePanel>
      
      {/* Did it Click? */}
      <EvidencePanel type="TOY_PEDAGOGICAL" title="Did It Click? — Learning Objectives Check" className="mb-6">
        <p className="text-lab-textMuted mb-4">
            The platform succeeds only if you can do all of the following:
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Explain token reasoning vs latent reasoning',
            'Describe what a recurrent latent update is',
            'Explain why more latent steps = more compute',
            'Explain why hidden reasoning is harder to observe',
            'Describe how BDH-CQ uses demonstrations & recurrent memory',
            'Name at least one limitation of latent reasoning',
          ].map((objective, i) => (
            <label key={i} className="flex items-center gap-3 p-3 bg-lab-panel/50 rounded-lg border border-lab-border/50 cursor-pointer hover:border-lab-borderBright">
              <input type="checkbox" className="w-4 h-4 rounded border-lab-border text-lab-accent focus:ring-lab-accent" />
              <span className="text-sm text-lab-text">{objective}</span>
            </label>
          ))}
        </div>
      </EvidencePanel>
      
      {/* Completion */}
      <div className="text-center p-8 bg-gradient-to-r from-lab-accentBg to-lab-infoBg border border-lab-accent/30 rounded-xl">
        <h3 className="font-display text-xl text-lab-text mb-2">Challenge Complete</h3>
        <p className="text-lab-textMuted max-w-xl mx-auto mb-4">
          You've explored how AI can "think more without saying more" — from token-based CoT to latent recurrent reasoning, 
          through BDH's synaptic reorganization of attention, to BDH-CQ's in-context learning with recurrent memory.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/evidence" className="btn-secondary">Review Evidence</a>
          <a href="/failure-lab" className="btn-secondary">Explore Failures</a>
          <a href="/" className="btn-primary">Back to Lab</a>
        </div>
      </div>
    </PageLayout>
  );
}