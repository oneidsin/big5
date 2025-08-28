import Link from "next/link";

export default function HomePage() {
  return (
    <div className="home-container">
      <img src="/big5.png" alt="logo" width={300} />
      <h1>빅5 성격 테스트란?</h1>
      <p>빅5(Big Five) 성격 테스트는 전 세계적으로 가장 널리 사용되는 심리 검사 중 하나로,
        인간의 성격을 개방성, 성실성, 외향성, 친화성, 정서적 안정성 다섯 가지 차원으로 분석합니다.</p>
      <p>이 검사는 학문적으로도 신뢰성과 타당성이 입증되어, 자기 이해뿐만 아니라 직업 적성, 대인 관계, 팀워크 등 다양한 분야에서 활용되고 있습니다.</p>
      <p>테스트 결과를 통해 나의 성격적 강점과 특성을 더 깊이 이해하고, 다른 사람들과의 관계에서도 더 나은 소통과 협력을 기대할 수 있습니다.</p>
      <Link href={"/test"}>
        <button className="test-btn">테스트하기!</button>
      </Link>
    </div>
  );
}